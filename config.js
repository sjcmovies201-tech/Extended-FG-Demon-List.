/* =====================================================================
   SETTINGS FILE. You only edit this file ONCE, when you set things up.
   After that, you run your whole site from the website itself
   (the "Admin" tab). No more editing files!

   GOLDEN RULES: keep the "quotes", keep the commas, don't delete brackets.
   ===================================================================== */

/* ---------- 1) YOUR WEBSITE'S NAME AND SETTINGS ---------- */
const SITE = {
  name: "The UFGIG Demonlist",                       // big title at the top
  tagline: "The hardest levels, beaten from our group!",     // small text under the title
  mainListSize: 25,       // levels #1 to #75 are the "Main List"
  extendedListSize: 25,  // levels #76 to #150 are the "Extended List"
                          // anything after that is the "Legacy List" (0 points)
  top1Points: 350         // how many points the #1 level is worth
};

/* ---------- 2) CONNECT YOUR DATABASE (Supabase) ----------
   Paste the two things Supabase gives you between the quotes.
   Leave them as "" and the site runs in DEMO MODE
   (fake example levels, no submitting, no admin).
*/
const SUPABASE_URL = "";   // looks like: https://abcdefgh.supabase.co
const SUPABASE_KEY = "";   // the "Publishable" key (or the older "anon" key)

/* ---------- 3) DEMO DATA (only used in demo mode) ---------- */
const DEMO_LEVELS = [
  { name: "Blade of Justice",   creator: "Manix648", verifier: "GDStripes", video: "https://www.youtube.com/watch?v=wazGj4JZ11o&t=143s", gameId: "35448603", requirement: 100 },
  { name: "Torsion",   creator: "Raivolt", verifier: "Particlez", video: "https://youtu.be/0pclHfE62kM?si=EUfGeUszuzsWCdtz", gameId: "65982725", requirement: 100 },
  { name: "Evangelion", creator: "Yoonsr", verifier: "Particlez", video: "https://www.youtube.com/watch?v=ATh4tbIz0HM", gameId: "62151546", requirement: 100 },
  { name: "Wind Storm",  creator: "Aimbotter2123", verifier: "Particlez", video: "https://youtu.be/jTN5gq3brkI?si=GJDyPCIFy5eRzfPM", gameId: "88940074", requirement: 100 },
  { name: "Exotic Energy",  creator: "Ellisha", verifier: "Particlez", video: "https://youtu.be/zuWCnYvMuw4?si=XO0OS855cAokWNBl", gameId: "57312412", requirement: 100 },
  { name: "Robi",  creator: "Robianny", verifier: "GDStripes", video: "https://www.youtube.com/watch?v=WVA2UvN8GHY", gameId: "88172786", requirement: 100 },
  { name: "Cataclysm",  creator: "Gboy", verifier: "Particlez", video: "https://youtu.be/pIEl0fs8riQ", gameId: "3979721", requirement: 100 },
];
const DEMO_RECORDS = [
  { player: "Player A", level: "Example Level One",   progress: 100, video: "" },
  { player: "Player A", level: "Example Level Three", progress: 100, video: "" },
  { player: "Player B", level: "Example Level Two",   progress: 100, video: "" },
  { player: "Player B", level: "Example Level Five",  progress: 100, video: "" },
  { player: "Player C", level: "Example Level Three", progress: 100, video: "" },
];
