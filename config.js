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
  top1Points: 350         // how many points the   #1 level is worth
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
  { name: "Wind Storm",  creator: "Aimbotter2123", verifier: "Particlez", video: "https://youtu.be/jTN5gq3brkI?si=GJDyPCIFy5eRzfPM", gameId: "88940074", requirement: 100 },
  { name: "Exotic Energy",  creator: "Ellisha", verifier: "Particlez", video: "https://youtu.be/zuWCnYvMuw4?si=XO0OS855cAokWNBl", gameId: "57312412", requirement: 100 },
  { name: "Robi",  creator: "Robianny", verifier: "GDStripes", video: "https://www.youtube.com/watch?v=WVA2UvN8GHY", gameId: "88172786", requirement: 100 },
  { name: "Cataclysm",  creator: "Gboy", verifier: "Particlez", video: "https://youtu.be/pIEl0fs8riQ", gameId: "3979721", requirement: 100 },
  { name: "Lost Love",  creator: "TheBlackHell", verifier: "Particlez", video: "https://youtu.be/PYlQ02CsCLM?si=4bgiAYPJZjtpkwA8YouTube", gameId: "85933508", requirement: 100 },
  { name: "Proteus",  creator: "SpergQuos", verifier: "Particlez", video: "https://youtu.be/n8Q8orYBcMg", gameId: "88943354", requirement: 100 },
  { name: "Sweater Weather",  creator: "VelYT", verifier: "StartingXY", video: "https://youtu.be/Dnt5GTrN4sU", gameId: "81148582", requirement: 100 },
  { name: "Acu",  creator: "Neigefeu", verifier: "Particlez", video: "https://youtu.be/9cbsVsOdosg?si=-ChQgWpPm-P65YPt", gameId: "61079355", requirement: 100 },
  { name: "Through The Decay",  creator: "Spark", verifier: "GDStripes", video: "https://www.youtube.com/watch?v=yMvLRvXmDxc", gameId: "114933189", requirement: 100 },
  { name: "Rose",  creator: "Eggsncoffee", verifier: "Particlez", video: "https://youtu.be/cZh-P3mugO4?si=NthPr_mivTGZAdyT", gameId: "90763727", requirement: 100 },
  { name: "Night Terrors",  creator: "Hinds", verifier: "StartingXY", video: "https://www.youtube.com/watch?v=nZAxgcF4VtI", gameId: "15395840", requirement: 100 },
  { name: "Fallen Club",  creator: "Trideapthbear", verifier: "Particlez", video: "https://youtu.be/cWRfUyqqPD4?si=ehRLaamSFkMOSRFA", gameId: "91180803", requirement: 100 },
  { name: "Magma Bound",  creator: "ScorchVX", verifier: "StartingXY", video: "https://www.youtube.com/watch?v=Jr2Z4-aCXS0&t=3s", gameId: "56568010", requirement: 100 },
  { name: "Windy Landscape",  creator: "Woogi411", verifier: "StartingXY", video: "https://www.youtube.com/watch?v=dKY5rKxTK0s", gameId: "4957691", requirement: 100 },
  { name: "Future Funk",  creator: "JonathanGD", verifier: "Particlez", video: "https://youtu.be/e7lbUH2bgnY?si=mc7KGh7LZzGjw1-H", gameId: "44062068", requirement: 100 },
  { name: "Thermodynamix",  creator: "Flash", verifier: "StartingXY", video: "https://www.youtube.com/watch?v=31RfJQ822Ug", gameId: "38445559", requirement: 100 },
  { name: "Nine Circles",  creator: "Zobros", verifier: "StartingXY", video: "https://www.youtube.com/watch?v=jbWbADw4nIA", gameId: "38445559", requirement: 100 },
  { name: "Megalovania",  creator: "EternaswipVMAX", verifier: "StartingXY", video: "https://www.youtube.com/watch?v=ZCB_gYNOhSk", gameId: "15427055", requirement: 100 },
];
const DEMO_RECORDS = [
  { player: "Particlez", level: "Sweater Weather",   progress: 100, video: "https://youtu.be/jUsUtoNaXwM?si=Y5vAkufqxK3Gqc5G" },
  { player: "GDStripes", level: "Sweater Weather", progress: 100, video: "https://www.youtube.com/watch?v=1ko4Pfmg9cE" },
  { player: "GDStripes", level: "Blade Of Justice",   progress: 100, video: "https://www.youtube.com/watch?v=wazGj4JZ11o&t=143s" },
  { player: "Particlez", level: "Torsion",  progress: 100, video: "https://youtu.be/0pclHfE62kM?si=EUfGeUszuzsWCdtz" },
  { player: "Particlez", level: "Wind Storm", progress: 100, video: "https://youtu.be/jTN5gq3brkI?si=GJDyPCIFy5eRzfPM" },
  { player: "Particlez", level: "Exotic Energy", progress: 100, video: "https://youtu.be/zuWCnYvMuw4?si=XO0OS855cAokWNBl" },
  { player: "GDStripes", level: "Robi", progress: 100, video: "https://www.youtube.com/watch?v=WVA2UvN8GHY" },
  { player: "Particlez", level: "Cataclysm", progress: 100, video: "https://youtu.be/pIEl0fs8riQ" },
  { player: "Particlez", level: "Lost Love", progress: 100, video: "https://youtu.be/PYlQ02CsCLM?si=4bgiAYPJZjtpkwA8YouTube" },
  { player: "Particlez", level: "Proteus", progress: 100, video: "https://youtu.be/n8Q8orYBcMg" },
  { player: "StartingXY", level: "Sweater Weather", progress: 100, video: "https://youtu.be/Dnt5GTrN4sU" },
  { player: "Particlez", level: "Acu", progress: 100, video: "https://youtu.be/9cbsVsOdosg?si=-ChQgWpPm-P65YPt" },
  { player: "GDStripes", level: "Through The Decay", progress: 100, video: "https://www.youtube.com/watch?v=yMvLRvXmDxc" },
  { player: "Particlez", level: "Rose", progress: 100, video: "https://youtu.be/cZh-P3mugO4?si=NthPr_mivTGZAdyT" },
  { player: "StartingXY", level: "Night Terrors", progress: 100, video: "https://www.youtube.com/watch?v=nZAxgcF4VtI" },
  { player: "Particlez", level: "Fallen Club", progress: 100, video: "https://youtu.be/cWRfUyqqPD4?si=ehRLaamSFkMOSRFA" },
  { player: "StartingXY", level: "Magma Bound", progress: 100, video: "https://www.youtube.com/watch?v=Jr2Z4-aCXS0&t=3s" },
  { player: "StartingXY", level: "Windy Landscape", progress: 100, video: "https://www.youtube.com/watch?v=dKY5rKxTK0s" },
  { player: "Particlez", level: "Future Funk", progress: 100, video: "https://youtu.be/e7lbUH2bgnY?si=mc7KGh7LZzGjw1-H" },
  { player: "StartingXY", level: "Thermodynamix", progress: 100, video: "https://www.youtube.com/watch?v=31RfJQ822Ug" },
  { player: "StartingXY", level: "Nine Circles", progress: 100, video: "https://www.youtube.com/watch?v=jbWbADw4nIA" },
  { player: "StartingXY", level: "Megalovania", progress: 100, video: "https://www.youtube.com/watch?v=ZCB_gYNOhSk" },
];
