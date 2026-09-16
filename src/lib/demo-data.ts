import { z } from 'zod';

const text = (max = 200) => z.string().max(max);
export const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'] as const;
export const prospectSchema = z.object({
  id: text(64), company: text(100).min(1), contact: text(100).min(1), email: z.union([z.literal(''), z.email()]),
  phone: text(30), city: text(100), territory: text(50), owner: text(80), stage: z.enum(stages),
  value: z.number().min(0).max(10000000), nextAction: text(300), notes: text(8000), updated: text(40),
});
export type Prospect = z.infer<typeof prospectSchema>;
export const taskSchema = z.object({ id: text(64), title: text(300).min(1), done: z.boolean() });
export const eventSchema = z.object({ id: text(64), title: text(300).min(1), time: text(50).min(1) });
export const draftSchema = z.object({ id: text(64), subject: text(200), body: text(5000) });
export const messageSchema = z.object({ role: z.enum(['user', 'assistant']), text: text(16000) });
export type Message = z.infer<typeof messageSchema>;
export const helgaSchema = z.object({ tasks: z.array(taskSchema).max(100), events: z.array(eventSchema).max(50), drafts: z.array(draftSchema).max(20), messages: z.array(messageSchema).max(40) });
export const documentsSchema = z.object({
  title: text(200), client: text(200), type: z.enum(['Proposal', 'Meeting summary']), notes: text(16000), body: text(20000),
  signature: z.object({ name: text(100), date: text(40) }).nullable(),
});
export const sourceSchema = z.object({ name: text(200), text: text(24000) });
export const rfpSchema = z.object({ title: text(200), client: text(200), requirements: text(16000), sources: z.array(sourceSchema).max(5), sections: z.array(z.object({ title: text(200), body: text(12000) })).length(3) });
export const pageSchema = z.object({ brand: text(100), headline: text(200), description: text(2000), button: text(60), email: z.email(), accent: z.enum(['blue', 'green', 'rose']) });
export const cmsSchema = z.object({ draft: pageSchema, published: pageSchema.nullable(), revision: z.number().int().min(0), publishedAt: text(40) });
export const receptionistSchema = z.object({
  business: text(120), knowledge: text(8000), messages: z.array(messageSchema).max(40),
  calls: z.array(z.object({ id: text(64), date: text(40), summary: text(12000), transcript: z.array(messageSchema).max(40) })).max(15),
});
export const schemas = { prospects: z.object({ prospects: z.array(prospectSchema).max(100) }), helga: helgaSchema, documents: documentsSchema, rfp: rfpSchema, cms: cmsSchema, receptionist: receptionistSchema };
export type Workspace = keyof typeof schemas;
export type WorkspaceData<K extends Workspace> = z.infer<(typeof schemas)[K]>;

const prospects: Prospect[] = [
  ['p1', 'Juniper Market', 'Alex Morgan', 'Grand Rapids', 'West Michigan', 'Qualified', 18500, 'Send the seasonal assortment', 'Independent neighborhood grocer. Interested in locally sourced snacks.'],
  ['p2', 'Northline Provisions', 'Jordan Lee', 'Traverse City', 'Northern Michigan', 'Proposal', 32000, 'Review delivery schedule', 'Needs a twice-weekly delivery window before opening.'],
  ['p3', 'Fieldwork Coffee', 'Sam Rivera', 'Holland', 'West Michigan', 'Contacted', 8500, 'Schedule a tasting', 'Two locations; exploring grab-and-go options.'],
  ['p4', 'Cedar & Main', 'Taylor Brooks', 'Lansing', 'Central Michigan', 'New', 12000, 'Introduce the product catalog', 'New neighborhood convenience store.'],
  ['p5', 'Lakeshore Pantry', 'Casey Ellis', 'Muskegon', 'West Michigan', 'Won', 24500, 'Plan the first delivery', 'Pilot order confirmed. Follow up after the first week.'],
  ['p6', 'Common Ground Deli', 'Riley Park', 'Ann Arbor', 'Southeast Michigan', 'Qualified', 16000, 'Confirm cold-storage capacity', 'Looking for prepared-food and beverage suppliers.'],
  ['p7', 'Oak Street Foods', 'Drew Hayes', 'Kalamazoo', 'West Michigan', 'Contacted', 14000, 'Follow up on samples', 'Sample box requested during discovery.'],
  ['p8', 'Pine Harbor Goods', 'Avery Chen', 'Petoskey', 'Northern Michigan', 'New', 21000, 'Arrange an introduction', 'Seasonal retailer with a summer-heavy sales cycle.'],
].map(([id, company, contact, city, territory, stage, value, nextAction, notes]) => ({ id: String(id), company: String(company), contact: String(contact), city: String(city), territory: String(territory), stage: stage as Prospect['stage'], value: Number(value), nextAction: String(nextAction), notes: String(notes), owner: 'You', email: `${String(id)}@example.com`, phone: '', updated: '2026-09-16T12:00:00Z' }));

const page = { brand: 'Fieldwork Studio', headline: 'Make room for good work.', description: 'Thoughtful spaces for independent people. A neighborhood studio for making, meeting, and finding your next idea.', button: 'Say hello', email: 'hello@example.com', accent: 'blue' as const };
export const seeds = {
  prospects: { prospects },
  helga: {
    tasks: [{ id: 't1', title: 'Review the Juniper proposal', done: false }, { id: 't2', title: 'Prepare questions for the design review', done: false }, { id: 't3', title: 'Send the weekly project update', done: true }],
    events: [{ id: 'e1', title: 'Morning planning', time: '09:00' }, { id: 'e2', title: 'Design review', time: '11:30' }, { id: 'e3', title: 'Client check-in', time: '14:00' }], drafts: [], messages: [],
  },
  documents: { title: 'A better way to work together', client: 'Juniper Market', type: 'Proposal' as const, notes: 'Juniper Market is a fictional neighborhood grocer with two locations. The team spends Monday mornings copying supplier orders from email into a spreadsheet. They want a shared order workspace, a clear delivery calendar, and a weekly summary. Begin with a two-week discovery phase, then a four-week pilot at one location. Success means staff can create, track, and review orders in one place. Pricing has not been agreed; do not invent a budget or savings figure.', body: '', signature: null },
  rfp: { title: 'Community learning center', client: 'Lakeshore Community Council', requirements: 'Prepare a response for a new community learning center. Explain your approach, relevant experience, and delivery plan. The council requires an accessible space, weekly progress reports, and a phased opening. Do not invent certifications, prices, or completed projects.', sources: [{ name: 'Studio qualifications.txt', text: 'DEMONSTRATION DATA. Fieldwork Studio is a fictional team specializing in community spaces. Its team includes a project lead, accessibility consultant, and construction coordinator. The proposed approach includes stakeholder interviews, concept review, accessibility review, and phased delivery. Weekly written progress reports are standard. The team has not supplied prior project references, certifications, a fee schedule, or a confirmed completion date.' }], sections: [{ title: 'Understanding & approach', body: '' }, { title: 'Team & experience', body: '' }, { title: 'Delivery & communication', body: '' }] },
  cms: { draft: page, published: page, revision: 1, publishedAt: '' },
  receptionist: { business: 'Juniper Home Services', knowledge: 'Fictional business for this demonstration. Open Monday to Friday, 8am–5pm. Serves Grand Rapids and Holland, Michigan. Offers general repairs, seasonal maintenance, and small renovation consultations. Consultation appointments must be confirmed by the team; never claim a booking is confirmed. Pricing is quoted after assessment. Take a name, a callback number, and a short description of the request. Emergency services are not offered.', messages: [], calls: [] },
} satisfies { [K in Workspace]: WorkspaceData<K> };
