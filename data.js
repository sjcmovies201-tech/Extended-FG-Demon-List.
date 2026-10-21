/* =====================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT.
   Everything on your website comes from here.

   GOLDEN RULES (so nothing breaks):
   1. Keep the "quotes" around words.   "like this"
   2. Keep the comma at the end of every line.   },
   3. Don't delete the [ ] or { } brackets.
   4. Copy a whole line to make a new one, then change the words.
   ===================================================================== */


/* ---------- 1) YOUR WEBSITE'S NAME AND SETTINGS ---------- */
const SITE = {
  name: "My Demonlist",                       // big title at the top
  tagline: "The hardest levels, ranked.",     // small text under the title
  mainListSize: 75,       // levels #1 to #75 are the "Main List"
  extendedListSize: 150,  // levels #76 to #150 are the "Extended List"
                          // anything after that is the "Legacy List" (0 points)
  top1Points: 350         // how many points the #1 level is worth
};


/* ---------- 2) THE LEVELS ----------
   ORDER = RANK. The first level is #1, the second is #2, and so on.
   To move a level up or down: cut its whole line and paste it somewhere else.
   You never type the rank number yourself. The site counts for you!

   name         = the level's name
   creator      = who built it
   verifier     = who beat it first
   video        = a YouTube link of the verification (or "" if none yet)
   levelId      = the in-game ID number (or "" if none)
   requirement  = the lowest % a player needs to get for it to count (usually 100)
*/
const LEVELS = [
  { name: "Example Level One",   creator: "Builder A", verifier: "Player A", video: "", levelId: "", requirement: 100 },
  { name: "Example Level Two",   creator: "Builder B", verifier: "Player B", video: "", levelId: "", requirement: 100 },
  { name: "Example Level Three", creator: "Builder C", verifier: "Player C", video: "", levelId: "", requirement: 100 },
  { name: "Example Level Four",  creator: "Builder D", verifier: "Player A", video: "", levelId: "", requirement: 100 },
  { name: "Example Level Five",  creator: "Builder E", verifier: "Player B", video: "", levelId: "", requirement: 100 },
];


/* ---------- 3) THE RECORDS (who beat what) ----------
   player    = the player's name (spell it the same way every time!)
   level     = the level's name (must match the name above EXACTLY)
   progress  = percent they got (100 = fully beaten)
   video     = a YouTube link as proof (or "")

   Points are worked out automatically. Players are ranked automatically.
*/
const RECORDS = [
  { player: "Player A", level: "Example Level One",   progress: 100, video: "" },
  { player: "Player A", level: "Example Level Three", progress: 100, video: "" },
  { player: "Player B", level: "Example Level Two",   progress: 100, video: "" },
  { player: "Player B", level: "Example Level Five",  progress: 100, video: "" },
  { player: "Player C", level: "Example Level Three", progress: 100, video: "" },
];
