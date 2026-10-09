import { VocabularyItem } from '../types';

/**
 * Verified canonical ARASAAC IDs directly retrieved from https://api.arasaac.org/api/pictograms/en/search/
 * Pictograms created by Sergio Palao for ARASAAC (Government of Aragon), Creative Commons BY-NC-SA
 */
export const INITIAL_VOCABULARY: VocabularyItem[] = [
  // --- SCHOOL ---
  {
    id: 'sch-teacher',
    arasaacId: 6556, // Schoolteacher
    word: 'Teacher',
    category: 'school',
    phonetic: '/ˈtiːtʃər/',
    syllables: 'teach • er',
    exampleSentence: 'The teacher helps us read.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-student',
    arasaacId: 5899, // Student / pupil
    word: 'Student',
    category: 'school',
    phonetic: '/ˈstjuːdənt/',
    syllables: 'stu • dent',
    exampleSentence: 'The student sits at the desk.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-school',
    arasaacId: 32446, // School building
    word: 'School',
    category: 'school',
    phonetic: '/skuːl/',
    syllables: 'school',
    exampleSentence: 'I go to school every day.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-book',
    arasaacId: 25191, // Book
    word: 'Book',
    category: 'school',
    phonetic: '/bʊk/',
    syllables: 'book',
    exampleSentence: 'I read a picture book.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-pencil',
    arasaacId: 2440, // Pencil
    word: 'Pencil',
    category: 'school',
    phonetic: '/ˈpɛnsəl/',
    syllables: 'pen • cil',
    exampleSentence: 'I write with a yellow pencil.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-backpack',
    arasaacId: 2475, // Backpack / rucksack
    word: 'Backpack',
    category: 'school',
    phonetic: '/ˈbækpæk/',
    syllables: 'back • pack',
    exampleSentence: 'My backpack is on my chair.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-table',
    arasaacId: 3129, // Table / desk
    word: 'Desk',
    category: 'school',
    phonetic: '/dɛsk/',
    syllables: 'desk',
    exampleSentence: 'Put the book on the desk.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-chair',
    arasaacId: 3155, // Chair
    word: 'Chair',
    category: 'school',
    phonetic: '/tʃɛər/',
    syllables: 'chair',
    exampleSentence: 'Sit on the chair, please.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-scissors',
    arasaacId: 2591, // Scissors
    word: 'Scissors',
    category: 'school',
    phonetic: '/ˈsɪzərz/',
    syllables: 'scis • sors',
    exampleSentence: 'We cut paper with scissors.',
    difficulty: 'intermediate',
  },
  {
    id: 'sch-paper',
    arasaacId: 8349, // Paper
    word: 'Paper',
    category: 'school',
    phonetic: '/ˈpeɪpər/',
    syllables: 'pa • per',
    exampleSentence: 'Draw on the clean paper.',
    difficulty: 'beginner',
  },
  {
    id: 'sch-computer',
    arasaacId: 7190, // Computer
    word: 'Computer',
    category: 'school',
    phonetic: '/kəmˈpjuːtər/',
    syllables: 'com • pu • ter',
    exampleSentence: 'We learn on the computer.',
    difficulty: 'intermediate',
  },
  {
    id: 'sch-blackboard',
    arasaacId: 2526, // Blackboard
    word: 'Blackboard',
    category: 'school',
    phonetic: '/ˈblækbɔːrd/',
    syllables: 'black • board',
    exampleSentence: 'Look at the blackboard.',
    difficulty: 'intermediate',
  },
  {
    id: 'sch-playground',
    arasaacId: 33064, // Schoolyard / playground
    word: 'Playground',
    category: 'school',
    phonetic: '/ˈpleɪɡraʊnd/',
    syllables: 'play • ground',
    exampleSentence: 'We play at the playground.',
    difficulty: 'intermediate',
  },
  {
    id: 'sch-bus',
    arasaacId: 2262, // Bus
    word: 'School Bus',
    category: 'school',
    phonetic: '/skuːl bʌs/',
    syllables: 'school • bus',
    exampleSentence: 'The bus takes us to school.',
    difficulty: 'beginner',
  },

  // --- FAMILY ---
  {
    id: 'fam-family',
    arasaacId: 38351, // Family
    word: 'Family',
    category: 'family',
    phonetic: '/ˈfæməli/',
    syllables: 'fam • i • ly',
    exampleSentence: 'I love my family.',
    difficulty: 'beginner',
  },
  {
    id: 'fam-mother',
    arasaacId: 2458, // Mum / mother
    word: 'Mother',
    category: 'family',
    phonetic: '/ˈmʌðər/',
    syllables: 'moth • er',
    exampleSentence: 'Mother hugs me.',
    difficulty: 'beginner',
  },
  {
    id: 'fam-father',
    arasaacId: 2497, // Father / dad
    word: 'Father',
    category: 'family',
    phonetic: '/ˈfɑːðər/',
    syllables: 'fa • ther',
    exampleSentence: 'Father reads a story.',
    difficulty: 'beginner',
  },
  {
    id: 'fam-brother',
    arasaacId: 2423, // Brother
    word: 'Brother',
    category: 'family',
    phonetic: '/ˈbrʌðər/',
    syllables: 'broth • er',
    exampleSentence: 'My brother plays with me.',
    difficulty: 'beginner',
  },
  {
    id: 'fam-sister',
    arasaacId: 2422, // Sister
    word: 'Sister',
    category: 'family',
    phonetic: '/ˈsɪstər/',
    syllables: 'sis • ter',
    exampleSentence: 'My sister smiles at me.',
    difficulty: 'beginner',
  },
  {
    id: 'fam-baby',
    arasaacId: 6060, // Baby
    word: 'Baby',
    category: 'family',
    phonetic: '/ˈbeɪbi/',
    syllables: 'ba • by',
    exampleSentence: 'The baby sleeps quietly.',
    difficulty: 'beginner',
  },
  {
    id: 'fam-grandmother',
    arasaacId: 23710, // Grandmother
    word: 'Grandmother',
    category: 'family',
    phonetic: '/ˈɡrændmʌðər/',
    syllables: 'grand • moth • er',
    exampleSentence: 'Grandmother bakes cookies.',
    difficulty: 'intermediate',
  },
  {
    id: 'fam-grandfather',
    arasaacId: 23718, // Grandfather
    word: 'Grandfather',
    category: 'family',
    phonetic: '/ˈɡrændfɑːðər/',
    syllables: 'grand • fa • ther',
    exampleSentence: 'Grandfather walks in the park.',
    difficulty: 'intermediate',
  },
  {
    id: 'fam-friend',
    arasaacId: 25790, // Friend
    word: 'Friend',
    category: 'family',
    phonetic: '/frɛnd/',
    syllables: 'friend',
    exampleSentence: 'My friend shares toys.',
    difficulty: 'beginner',
  },
  {
    id: 'fam-dog',
    arasaacId: 7202, // Dog
    word: 'Dog',
    category: 'family',
    phonetic: '/dɒɡ/',
    syllables: 'dog',
    exampleSentence: 'The friendly dog wags its tail.',
    difficulty: 'beginner',
  },
  {
    id: 'fam-cat',
    arasaacId: 7114, // Cat
    word: 'Cat',
    category: 'family',
    phonetic: '/kæt/',
    syllables: 'cat',
    exampleSentence: 'The soft cat purrs.',
    difficulty: 'beginner',
  },

  // --- HOME ---
  {
    id: 'hom-house',
    arasaacId: 6964, // House / home
    word: 'House',
    category: 'home',
    phonetic: '/haʊs/',
    syllables: 'house',
    exampleSentence: 'Welcome to my house.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-bedroom',
    arasaacId: 5988, // Bedroom
    word: 'Bedroom',
    category: 'home',
    phonetic: '/ˈbɛdruːm/',
    syllables: 'bed • room',
    exampleSentence: 'I rest in my bedroom.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-kitchen',
    arasaacId: 10752, // Kitchen
    word: 'Kitchen',
    category: 'home',
    phonetic: '/ˈkɪtʃɪn/',
    syllables: 'kitch • en',
    exampleSentence: 'We cook in the kitchen.',
    difficulty: 'intermediate',
  },
  {
    id: 'hom-bathroom',
    arasaacId: 5921, // Bathroom / toilet
    word: 'Bathroom',
    category: 'home',
    phonetic: '/ˈbɑːθruːm/',
    syllables: 'bath • room',
    exampleSentence: 'Wash your hands in the bathroom.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-livingroom',
    arasaacId: 6211, // Living room
    word: 'Living Room',
    category: 'home',
    phonetic: '/ˈlɪvɪŋ ruːm/',
    syllables: 'liv • ing • room',
    exampleSentence: 'We sit in the living room.',
    difficulty: 'intermediate',
  },
  {
    id: 'hom-door',
    arasaacId: 3244, // Door
    word: 'Door',
    category: 'home',
    phonetic: '/dɔːr/',
    syllables: 'door',
    exampleSentence: 'Open the door, please.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-window',
    arasaacId: 2611, // Window
    word: 'Window',
    category: 'home',
    phonetic: '/ˈwɪndoʊ/',
    syllables: 'win • dow',
    exampleSentence: 'Look through the window.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-bed',
    arasaacId: 25900, // Bed
    word: 'Bed',
    category: 'home',
    phonetic: '/bɛd/',
    syllables: 'bed',
    exampleSentence: 'Sleep in your cozy bed.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-spoon',
    arasaacId: 2362, // Spoon
    word: 'Spoon',
    category: 'home',
    phonetic: '/spuːn/',
    syllables: 'spoon',
    exampleSentence: 'Eat soup with a spoon.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-fork',
    arasaacId: 2588, // Fork
    word: 'Fork',
    category: 'home',
    phonetic: '/fɔːrk/',
    syllables: 'fork',
    exampleSentence: 'Use a fork for food.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-cup',
    arasaacId: 2582, // Cup
    word: 'Cup',
    category: 'home',
    phonetic: '/kʌp/',
    syllables: 'cup',
    exampleSentence: 'Drink water from a cup.',
    difficulty: 'beginner',
  },
  {
    id: 'hom-plate',
    arasaacId: 16857, // Plate
    word: 'Plate',
    category: 'home',
    phonetic: '/pleɪt/',
    syllables: 'plate',
    exampleSentence: 'Food is on the plate.',
    difficulty: 'beginner',
  },

  // --- WEATHER ---
  {
    id: 'wea-sun',
    arasaacId: 7252, // Sun
    word: 'Sunny',
    category: 'weather',
    phonetic: '/ˈsʌni/',
    syllables: 'sun • ny',
    exampleSentence: 'It is warm and sunny today.',
    difficulty: 'beginner',
  },
  {
    id: 'wea-rain',
    arasaacId: 7148, // Rain
    word: 'Rainy',
    category: 'weather',
    phonetic: '/ˈreɪni/',
    syllables: 'rain • y',
    exampleSentence: 'Take an umbrella on a rainy day.',
    difficulty: 'beginner',
  },
  {
    id: 'wea-cloud',
    arasaacId: 34383, // Cloud
    word: 'Cloudy',
    category: 'weather',
    phonetic: '/ˈklaʊdi/',
    syllables: 'cloud • y',
    exampleSentence: 'The sky is grey and cloudy.',
    difficulty: 'beginner',
  },
  {
    id: 'wea-snow',
    arasaacId: 7172, // Snow
    word: 'Snowy',
    category: 'weather',
    phonetic: '/ˈsnoʊi/',
    syllables: 'snow • y',
    exampleSentence: 'It is snowy and cold outside.',
    difficulty: 'beginner',
  },
  {
    id: 'wea-wind',
    arasaacId: 7259, // Wind
    word: 'Windy',
    category: 'weather',
    phonetic: '/ˈwɪndi/',
    syllables: 'wind • y',
    exampleSentence: 'Windy air moves the trees.',
    difficulty: 'beginner',
  },
  {
    id: 'wea-hot',
    arasaacId: 2300, // Hot
    word: 'Hot',
    category: 'weather',
    phonetic: '/hɒt/',
    syllables: 'hot',
    exampleSentence: 'The summer sun is very hot.',
    difficulty: 'beginner',
  },
  {
    id: 'wea-cold',
    arasaacId: 4652, // Cold
    word: 'Cold',
    category: 'weather',
    phonetic: '/koʊld/',
    syllables: 'cold',
    exampleSentence: 'Wear a jacket when it is cold.',
    difficulty: 'beginner',
  },
  {
    id: 'wea-rainbow',
    arasaacId: 2986, // Rainbow
    word: 'Rainbow',
    category: 'weather',
    phonetic: '/ˈreɪnboʊ/',
    syllables: 'rain • bow',
    exampleSentence: 'A colourful rainbow in the sky.',
    difficulty: 'intermediate',
  },
  {
    id: 'wea-storm',
    arasaacId: 34892, // Storm
    word: 'Storm',
    category: 'weather',
    phonetic: '/stɔːrm/',
    syllables: 'storm',
    exampleSentence: 'Stay inside during a storm.',
    difficulty: 'intermediate',
  },
  {
    id: 'wea-spring',
    arasaacId: 5553, // Spring
    word: 'Spring',
    category: 'weather',
    phonetic: '/sprɪŋ/',
    syllables: 'spring',
    exampleSentence: 'Flowers grow in spring.',
    difficulty: 'intermediate',
  },
  {
    id: 'wea-summer',
    arasaacId: 5604, // Summer
    word: 'Summer',
    category: 'weather',
    phonetic: '/ˈsʌmər/',
    syllables: 'sum • mer',
    exampleSentence: 'We go to the beach in summer.',
    difficulty: 'intermediate',
  },
  {
    id: 'wea-autumn',
    arasaacId: 5531, // Autumn
    word: 'Autumn',
    category: 'weather',
    phonetic: '/ˈɔːtəm/',
    syllables: 'au • tumn',
    exampleSentence: 'Leaves turn orange in autumn.',
    difficulty: 'intermediate',
  },
  {
    id: 'wea-winter',
    arasaacId: 5493, // Winter
    word: 'Winter',
    category: 'weather',
    phonetic: '/ˈwɪntər/',
    syllables: 'win • ter',
    exampleSentence: 'Winter is the coldest season.',
    difficulty: 'intermediate',
  },

  // --- MOODS & FEELINGS ---
  {
    id: 'moo-happy',
    arasaacId: 35533, // Happy face
    word: 'Happy',
    category: 'moods',
    phonetic: '/ˈhæpi/',
    syllables: 'hap • py',
    exampleSentence: 'I feel very happy today.',
    difficulty: 'beginner',
  },
  {
    id: 'moo-sad',
    arasaacId: 35545, // Sad face
    word: 'Sad',
    category: 'moods',
    phonetic: '/sæd/',
    syllables: 'sad',
    exampleSentence: 'I ask for a hug when I feel sad.',
    difficulty: 'beginner',
  },
  {
    id: 'moo-angry',
    arasaacId: 35539, // Angry face
    word: 'Angry',
    category: 'moods',
    phonetic: '/ˈæŋɡri/',
    syllables: 'an • gry',
    exampleSentence: 'I take deep breaths when angry.',
    difficulty: 'beginner',
  },
  {
    id: 'moo-tired',
    arasaacId: 35537, // Tired face
    word: 'Tired',
    category: 'moods',
    phonetic: '/ˈtaɪərd/',
    syllables: 'tired',
    exampleSentence: 'I am tired and want to rest.',
    difficulty: 'beginner',
  },
  {
    id: 'moo-excited',
    arasaacId: 39090, // Excited
    word: 'Excited',
    category: 'moods',
    phonetic: '/ɪkˈsaɪtɪd/',
    syllables: 'ex • cit • ed',
    exampleSentence: 'I am excited to play!',
    difficulty: 'intermediate',
  },
  {
    id: 'moo-scared',
    arasaacId: 35535, // Scared
    word: 'Scared',
    category: 'moods',
    phonetic: '/skɛərd/',
    syllables: 'scared',
    exampleSentence: 'Hold my hand when I am scared.',
    difficulty: 'beginner',
  },
  {
    id: 'moo-calm',
    arasaacId: 31310, // Calm / peaceful
    word: 'Calm',
    category: 'moods',
    phonetic: '/kɑːm/',
    syllables: 'calm',
    exampleSentence: 'I feel calm and relaxed.',
    difficulty: 'intermediate',
  },
  {
    id: 'moo-surprised',
    arasaacId: 35529, // Surprised
    word: 'Surprised',
    category: 'moods',
    phonetic: '/sərˈpraɪzd/',
    syllables: 'sur • prised',
    exampleSentence: 'I was surprised by the gift!',
    difficulty: 'intermediate',
  },
  {
    id: 'moo-sick',
    arasaacId: 7040, // Sick / unwell
    word: 'Sick',
    category: 'moods',
    phonetic: '/sɪk/',
    syllables: 'sick',
    exampleSentence: 'I stay home when I feel sick.',
    difficulty: 'beginner',
  },
  {
    id: 'moo-hungry',
    arasaacId: 4962, // Hungry
    word: 'Hungry',
    category: 'moods',
    phonetic: '/ˈhʌŋɡri/',
    syllables: 'hun • gry',
    exampleSentence: 'I want food because I am hungry.',
    difficulty: 'beginner',
  },
  {
    id: 'moo-thirsty',
    arasaacId: 4963, // Thirsty
    word: 'Thirsty',
    category: 'moods',
    phonetic: '/ˈθɜːrsti/',
    syllables: 'thirst • y',
    exampleSentence: 'I want water because I am thirsty.',
    difficulty: 'beginner',
  },
  {
    id: 'moo-proud',
    arasaacId: 31408, // Proud
    word: 'Proud',
    category: 'moods',
    phonetic: '/praʊd/',
    syllables: 'proud',
    exampleSentence: 'I am proud of my hard work.',
    difficulty: 'intermediate',
  },

  // --- ACTIONS ---
  {
    id: 'act-eat',
    arasaacId: 6456, // Eat
    word: 'Eat',
    category: 'actions',
    phonetic: '/iːt/',
    syllables: 'eat',
    exampleSentence: 'I eat my fruit snack.',
    difficulty: 'beginner',
  },
  {
    id: 'act-drink',
    arasaacId: 6061, // Drink
    word: 'Drink',
    category: 'actions',
    phonetic: '/drɪŋk/',
    syllables: 'drink',
    exampleSentence: 'Drink fresh water.',
    difficulty: 'beginner',
  },
  {
    id: 'act-play',
    arasaacId: 23392, // Play
    word: 'Play',
    category: 'actions',
    phonetic: '/pleɪ/',
    syllables: 'play',
    exampleSentence: 'We play games nicely.',
    difficulty: 'beginner',
  },
  {
    id: 'act-read',
    arasaacId: 7141, // Read
    word: 'Read',
    category: 'actions',
    phonetic: '/riːd/',
    syllables: 'read',
    exampleSentence: 'I read stories with teacher.',
    difficulty: 'beginner',
  },
  {
    id: 'act-write',
    arasaacId: 2380, // Write
    word: 'Write',
    category: 'actions',
    phonetic: '/raɪt/',
    syllables: 'write',
    exampleSentence: 'I write my name.',
    difficulty: 'beginner',
  },
  {
    id: 'act-listen',
    arasaacId: 6572, // Hear / listen
    word: 'Listen',
    category: 'actions',
    phonetic: '/ˈlɪsən/',
    syllables: 'lis • ten',
    exampleSentence: 'Listen carefully, please.',
    difficulty: 'beginner',
  },
  {
    id: 'act-sleep',
    arasaacId: 6479, // Sleep
    word: 'Sleep',
    category: 'actions',
    phonetic: '/sliːp/',
    syllables: 'sleep',
    exampleSentence: 'I sleep every night.',
    difficulty: 'beginner',
  },
  {
    id: 'act-walk',
    arasaacId: 29951, // Walk
    word: 'Walk',
    category: 'actions',
    phonetic: '/wɔːk/',
    syllables: 'walk',
    exampleSentence: 'We walk together quietly.',
    difficulty: 'beginner',
  },
  {
    id: 'act-help',
    arasaacId: 32648, // Help
    word: 'Help',
    category: 'actions',
    phonetic: '/hɛlp/',
    syllables: 'help',
    exampleSentence: 'I can help you.',
    difficulty: 'beginner',
  },
  {
    id: 'act-look',
    arasaacId: 6564, // See / look
    word: 'Look',
    category: 'actions',
    phonetic: '/lʊk/',
    syllables: 'look',
    exampleSentence: 'Look at the picture.',
    difficulty: 'beginner',
  },

  // --- FOOD & DRINKS ---
  {
    id: 'foo-apple',
    arasaacId: 2462, // Apple
    word: 'Apple',
    category: 'food',
    phonetic: '/ˈæpəl/',
    syllables: 'ap • ple',
    exampleSentence: 'I love eating red apples.',
    difficulty: 'beginner',
  },
  {
    id: 'foo-banana',
    arasaacId: 2530, // Banana
    word: 'Banana',
    category: 'food',
    phonetic: '/bəˈnænə/',
    syllables: 'ba • nan • a',
    exampleSentence: 'The sweet yellow banana.',
    difficulty: 'beginner',
  },
  {
    id: 'foo-bread',
    arasaacId: 2494, // Bread
    word: 'Bread',
    category: 'food',
    phonetic: '/brɛd/',
    syllables: 'bread',
    exampleSentence: 'Fresh warm bread.',
    difficulty: 'beginner',
  },
  {
    id: 'foo-water',
    arasaacId: 32464, // Water
    word: 'Water',
    category: 'food',
    phonetic: '/ˈwɔːtər/',
    syllables: 'wa • ter',
    exampleSentence: 'Drink cold water.',
    difficulty: 'beginner',
  },
  {
    id: 'foo-milk',
    arasaacId: 2445, // Milk
    word: 'Milk',
    category: 'food',
    phonetic: '/mɪlk/',
    syllables: 'milk',
    exampleSentence: 'A fresh cup of milk.',
    difficulty: 'beginner',
  },
  {
    id: 'foo-pizza',
    arasaacId: 2527, // Pizza
    word: 'Pizza',
    category: 'food',
    phonetic: '/ˈpiːtsə/',
    syllables: 'piz • za',
    exampleSentence: 'We share hot pizza.',
    difficulty: 'beginner',
  },
  {
    id: 'foo-sandwich',
    arasaacId: 2281, // Sandwich
    word: 'Sandwich',
    category: 'food',
    phonetic: '/ˈsænwɪtʃ/',
    syllables: 'sand • wich',
    exampleSentence: 'A healthy cheese sandwich.',
    difficulty: 'intermediate',
  },
  {
    id: 'foo-fruit',
    arasaacId: 28339, // Fruit
    word: 'Fruit',
    category: 'food',
    phonetic: '/fruːt/',
    syllables: 'fruit',
    exampleSentence: 'Fresh fruit gives us energy.',
    difficulty: 'beginner',
  },
];

export const getArasaacImageUrl = (arasaacId: number): string => {
  return `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_500.png`;
};
