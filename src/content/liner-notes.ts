import type { LinerNotes } from './types';

/**
 * "LINER NOTES" copy for the Phase 5 album-detail view — what I built / why
 * I built it / technical challenges / what I learned, per project.
 *
 * Drafted now from the resume, existing site copy, and each project's
 * public repo (READMEs, commit history, Devpost writeups) while that
 * research context is fresh — not rendered anywhere until Phase 5.
 * Melody edits this file directly; nothing here is final copy.
 */
export const linerNotes: Record<string, LinerNotes> = {
  'ser-tibbles': {
    built: "A Discord bot with two commands — genre_track_recommend and recommend_url — that hits the Spotify API for five-song recommendations, authenticated via Spotify's client-credentials flow and wired into Discord through discord.py.",
    why: "Inspired by Marina Muse, a collaborative campus playlist where friends took turns curating tracks — it exposed us to genres we'd never have found alone, and we wanted to bottle that discovery mechanic into a bot anyone could run in their own server.",
    challenges: [
      "Configuring Discord's Gateway Intents correctly — without the right intents enabled, the bot silently couldn't see the events it needed.",
      "Securing the Discord token: learned to load it from a .env file via python-dotenv instead of hardcoding it, our first real exposure to keeping secrets out of source control.",
    ],
    learned: [
      "First time integrating a third-party API end-to-end — authentication, request shaping, and error handling for missing results.",
      "How much a tight scope (two commands, one API) helps you actually ship during a hackathon deadline.",
    ],
  },
  cafinity: {
    built: 'A cafe discovery app built with a 5-person team: Firebase Auth with role-based access, a Firestore-backed owner dashboard, an OpenAI moderation pipeline for user reviews, and a Google Maps search view with clustering and Haversine distance filtering.',
    why: "Campus cafe recommendations were scattered across group chats and reviews that weren't calibrated for student budgets or study-friendliness — we wanted one place with amenity filters (outlets, wifi, quiet hours) and reviews that were actually moderated.",
    challenges: [
      'Built the SearchFilter component to run multi-criteria amenity queries directly against Firestore, instead of pulling everything client-side and filtering in memory — kept results consistent with live database state.',
      'Coordinating Firestore security rules and role-based access across a 5-person team without anyone accidentally opening up write access.',
    ],
    learned: [
      'How to structure Firestore queries around the constraints of a NoSQL document store instead of thinking in SQL joins.',
      'What it takes to keep a moderation pipeline honest — false positives frustrate real reviewers, false negatives let spam through.',
    ],
  },
  pennysprout: {
    built: "A finance analyzer that ingests CSV and PDF bank statements (via Claude's native PDF support), generates a 1–10 financial health score and monthly cash-flow breakdowns with Recharts, and persists everything per-user in Supabase behind Clerk auth and Row Level Security.",
    why: 'Budgeting apps either want you to link your bank account or make you manually categorize every transaction. I wanted to just drop in a statement I already had and get insight back immediately, without handing a third party read access to my bank.',
    challenges: [
      "Getting Claude to categorize transactions consistently across statement formats from different banks, without hallucinating categories that don't exist.",
      'Designing Supabase RLS policies plus a server-side service-role path, so per-user data stays isolated but scheduled/background jobs can still operate on it.',
      'Sanitizing statement data before storage — stripping everything except the transaction fields actually needed, so a database leak would not expose full statement contents.',
    ],
    learned: [
      'Caching AI analysis results per month in a separate table eliminates redundant API calls on repeat views — a small schema decision with an outsized cost impact.',
      'Row Level Security is a real access-control layer, not a formality — worth designing before writing the first query, not after.',
    ],
  },
  'rift-rewind': {
    built: 'Pulls a full ranked season of Riot match history, aggregates win rate, KDA, and champion stats, then generates personalized coaching through Claude on AWS Bedrock, with DynamoDB caching to stay under Riot API rate limits — delivered as a recap in Discord.',
    why: 'Spotify Wrapped made me want the same thing for League — a season in review that is actually about how I played, not just raw stats I would have to interpret myself.',
    challenges: [
      'Staying under Riot API rate limits while pulling a full season of match history meant DynamoDB caching was not optional — it was the difference between the tool working and getting throttled mid-run.',
      'Getting Bedrock-hosted Claude to produce coaching that referenced specific match patterns instead of generic advice that could apply to any player.',
    ],
    learned: [
      'How to work with AWS Bedrock as a model-hosting layer instead of calling a model API directly — different auth, different request shape.',
      'Aggregating raw match data into stats that are actually meaningful (per-champion trends, not just season averages) is most of the work.',
    ],
  },
  'animals10-classifier': {
    built: 'VGG16 implemented from scratch in PyTorch — batch normalization, dropout, and cosine-annealing learning-rate scheduling — trained for 15 epochs to 85% accuracy across 10 animal species.',
    why: 'Wanted to actually build a CNN architecture layer-by-layer instead of just fine-tuning a pretrained model, to understand why the design choices in VGG16 exist rather than just importing torchvision.models.vgg16.',
    challenges: [
      'A ResNet50 baseline at comparable depth overfit the dataset — diagnosing that and comparing it against the from-scratch VGG16 was the actual experiment, not just hitting a target accuracy number.',
      'Tuning cosine-annealing LR scheduling and dropout together without a validation-loss curve that looked like it was just memorizing the training set.',
    ],
    learned: [
      'Why batch normalization placement matters as much as its presence — where you put it in the block changes training stability.',
      'Depth is not free — a deeper network overfitting a smaller dataset is a real, common failure mode, not a hypothetical from a textbook.',
    ],
  },
  'cecs-327-distributed-systems': {
    built: 'Two labs: a Dockerized client/server app for the first, and a from-scratch implementation of multicast and anycast group messaging over raw sockets for the second — each containerized and documented in a written technical report.',
    why: 'Coursework for CSULB’s Distributed Computing class, focused on the networking primitives most web developers never touch directly — multicast and anycast — instead of building on top of an abstraction that hides them.',
    challenges: [
      "Getting multicast group membership and anycast routing to behave correctly across containers, where Docker's default networking does not behave like a real multi-host network.",
      'Debugging socket-level code with no framework to hide the failure modes — a dropped or malformed packet just breaks silently unless you instrument for it yourself.',
    ],
    learned: [
      'How multicast and anycast actually differ from a socket-programming perspective, not just as diagram-level networking concepts.',
      'Containerizing this kind of client/server system exercises real distributed-systems failure modes (partial failure, ordering, timing) that localhost never would.',
    ],
  },
  f1gpt: {
    built: 'A RAG chatbot that scrapes Wikipedia and the official F1 site with Puppeteer, chunks the text with LangChain, embeds it into DataStax Astra DB, and streams GPT-4o responses in real time through the Vercel AI SDK for a ChatGPT-style experience.',
    why: "Wanted a place to ask specific F1 questions — a driver's stats in a particular season, a rule change's history — and get an answer grounded in real sources instead of an LLM's general (and often outdated) knowledge.",
    challenges: [
      'The Vercel AI SDK shipped breaking changes across major versions mid-project — had to rewrite streaming API calls, chat hook imports, and response format handling to restore functionality that had worked the week before.',
      'Chunking scraped F1 content in a way that kept retrieved context coherent, instead of splitting mid-sentence or mid-table and feeding the model fragments that did not mean anything on their own.',
    ],
    learned: [
      'Retrieval quality bottlenecks a RAG pipeline more than model choice does — bad chunks produce bad answers no matter how good the underlying model is.',
      'Depending on a fast-moving SDK means budgeting real time for migrations, not just feature work.',
    ],
  },
  'modo-matcha': {
    built: 'A live-event ordering system with synchronized customer- and kitchen-facing screens, built on Firebase/Firestore real-time sync, deployed for an actual catering event serving 200+ guests with zero fulfillment errors.',
    why: 'Watched a matcha pop-up run entirely on shouted orders and sticky notes and figured the kitchen and the counter needed to see the same queue, live, without either side re-entering anything.',
    challenges: [
      'Validating Firestore real-time sync end-to-end before a live event with no second chance — any desync between the customer and kitchen screens would have meant lost or duplicated orders in front of a real line.',
      'Scoping the product and directing the build myself while keeping the UI simple enough for kitchen staff to use under real service pressure, not just in a demo.',
    ],
    learned: [
      "The gap between 'works in dev' and 'works live in front of a paying line' is mostly about testing failure paths, not the happy path.",
      'Owning a product end-to-end — scope, build, and the actual event — is a different skill set than just being handed a spec.',
    ],
  },
};
