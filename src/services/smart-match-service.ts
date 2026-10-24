import { EventCategory, EventItem, SmartMatchResult } from '../types';
import { eventsService } from './events-service';
import { authService } from './auth-service';
import { isDemoMode, apiClient } from './api-client';

export interface SmartMatchOptions {
  userInterests?: EventCategory[];
  preferredNeighborhood?: string;
  preferFreeOnly?: boolean;
}

export const smartMatchService = {
  async getRecommendations(options?: SmartMatchOptions): Promise<SmartMatchResult[]> {
    if (!isDemoMode()) {
      return apiClient.get<SmartMatchResult[]>('/smart-match/recommendations', {
        interests: options?.userInterests?.join(','),
        neighborhood: options?.preferredNeighborhood,
        freeOnly: options?.preferFreeOnly,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    const user = authService.getCurrentUser();
    const interests = options?.userInterests || user?.interests || ['Food & Community', 'Live Music & Culture'];
    const neighborhood = options?.preferredNeighborhood || user?.neighborhood || 'Silverlake Commons';
    const preferFree = options?.preferFreeOnly ?? false;

    const { data: events } = await eventsService.getEvents({}, 1, 50);

    const scored: SmartMatchResult[] = events.map((event: EventItem) => {
      let score = 30; // Baseline score
      const matchReasons: string[] = [];

      // Category / Interest Match (+35)
      if (interests.includes(event.category)) {
        score += 35;
        matchReasons.push(`Matches your interest in ${event.category}`);
      }

      // Tag Match (+15)
      const matchingTags = event.tags.filter((tag) =>
        interests.some((interest) => interest.toLowerCase().includes(tag.toLowerCase()))
      );
      if (matchingTags.length > 0) {
        score += 15;
        matchReasons.push(`Aligned tags: ${matchingTags.slice(0, 2).join(', ')}`);
      }

      // Neighborhood Match (+20)
      if (neighborhood && event.neighborhood === neighborhood) {
        score += 20;
        matchReasons.push(`Located directly in your home neighborhood (${neighborhood})`);
      } else {
        score += 5;
        matchReasons.push(`Within 15 min transit in ${event.neighborhood}`);
      }

      // Price preference (+10)
      if (preferFree && event.price === 0) {
        score += 10;
        matchReasons.push('Free community admission');
      } else if (!preferFree && event.price === 0) {
        score += 5;
      }

      // High availability boost (+5)
      const remainingCapacity = event.capacity - event.registeredCount;
      if (remainingCapacity > 10) {
        score += 5;
        matchReasons.push('Good seating & registration availability');
      }

      // Cap at 98 for realistic presentation
      const finalScore = Math.min(98, score);

      return {
        event,
        score: finalScore,
        matchReasons,
      };
    });

    // Sort descending by deterministic score
    return scored.sort((a, b) => b.score - a.score);
  },
};
