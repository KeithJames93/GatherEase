
'use server';
/**
 * @fileOverview A Genkit flow for brainstorming party ideas based on host input.
 *
 * - brainstormPartyIdeas - A function that handles the party idea brainstorming process.
 * - BrainstormPartyIdeasInput - The input type for the brainstormPartyIdeas function.
 * - BrainstormPartyIdeasOutput - The return type for the brainstormPartyIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrainstormPartyIdeasInputSchema = z.object({
  partyName: z.string().describe('The name of the party.'),
  partyType: z
    .string()
    .optional()
    .describe('The type of party, e.g., Birthday, Anniversary, Holiday.'),
  partyDate: z.string().optional().describe('The date of the party.'),
  numberOfGuests: z.number().optional().describe('Approximate number of guests.'),
  budget: z.string().optional().describe('The approximate budget for the party, e.g., low, medium, high.'),
  specialRequests: z
    .string()
    .optional()
    .describe('Any special requests or constraints, e.g., unique cocktail names, beach-themed activities, low-budget decorations.'),
});
export type BrainstormPartyIdeasInput = z.infer<typeof BrainstormPartyIdeasInputSchema>;

const BrainstormPartyIdeasOutputSchema = z.object({
  themes: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).describe('Suggested themes for the party.'),
  activities: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).describe('Suggested activities for the party.'),
  menuSuggestions: z.array(z.object({
    item: z.string(),
    reason: z.string(),
  })).describe('Suggested food and drinks for the party.'),
});
export type BrainstormPartyIdeasOutput = z.infer<typeof BrainstormPartyIdeasOutputSchema>;

export async function brainstormPartyIdeas(input: BrainstormPartyIdeasInput): Promise<BrainstormPartyIdeasOutput> {
  return brainstormPartyIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brainstormPartyIdeasPrompt',
  input: {schema: BrainstormPartyIdeasInputSchema},
  output: {schema: BrainstormPartyIdeasOutputSchema},
  prompt: `You are a professional party planner with a creative and energetic personality.
Your goal is to help a host brainstorm amazing ideas for their party: "{{partyName}}".

Use the following details to tailor your suggestions:
- Party Type: {{partyType}}
- Date: {{partyDate}}
- Number of Guests: {{numberOfGuests}}
- Budget: {{budget}}
- Special Requests: {{specialRequests}}

Provide a variety of creative themes, fun activities, and delicious menu suggestions that fit the vibe.`,
});

const brainstormPartyIdeasFlow = ai.defineFlow(
  {
    name: 'brainstormPartyIdeasFlow',
    inputSchema: BrainstormPartyIdeasInputSchema,
    outputSchema: BrainstormPartyIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
