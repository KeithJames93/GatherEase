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
    .describe('Any special requests or constraints, e.g., 