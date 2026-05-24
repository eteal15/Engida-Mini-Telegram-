import { Story, Chapter, UserProfile, Comment } from './types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_admin',
    name: 'Lena Edward (Admin)',
    email: 'lenaedward949@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'admin',
    coins: 1250,
    streak: 15,
    badges: ['Admin Supreme', 'Ethiopian Literature Patron', 'Super Reader'],
    lastActive: new Date().toISOString()
  },
  {
    id: 'writer_abera',
    name: 'Abera Molla',
    email: 'abera@engida.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    role: 'writer',
    coins: 75,
    streak: 42,
    badges: ['Master Storyteller', 'Milestone Creator', 'Pro Writer'],
    lastActive: new Date().toISOString(),
    telebirrNumber: '0911223344'
  },
  {
    id: 'writer_selam',
    name: 'Selamawit Kebede',
    email: 'selam@engida.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    role: 'writer',
    coins: 300,
    streak: 8,
    badges: ['Rising Star', 'Wordsmith'],
    lastActive: new Date().toISOString(),
    telebirrNumber: '0912345678'
  },
  {
    id: 'reader_yared',
    name: 'Yared Melaku',
    email: 'yared@engida.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'reader',
    coins: 45,
    streak: 3,
    badges: ['Bookworm'],
    lastActive: new Date().toISOString()
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    title: 'የስደተኛው ማስታወሻ',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=500',
    description: 'በበረሃው ግርማ ሞገስና በስደት ፈተናዎች ውስጥ ያለፉ ኢትዮጵያውያን እውነተኛ ታሪክ የሚያሳይ ልብ የሚነካ ታሪክ። በፍቅር፣ በትግልና በተስፋ የተሞላ።',
    descriptionAmh: 'በበረሃው ግርማ ሞገስና በስደት ፈተናዎች ውስጥ ያለፉ ኢትዮጵያውያን እውነተኛ ታሪክ የሚያሳይ ልብ የሚነካ ታሪክ። በፍቅር፣ በትግልና በተስፋ የተሞላ።',
    genres: ['True Stories / Fact Based', 'Drama', 'Adventure'],
    authorId: 'writer_abera',
    authorName: 'Abera Molla',
    status: 'completed',
    views: 12450,
    likes: 840,
    bookmarksCount: 310,
    unlockCount: 450,
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story_2',
    title: 'ካፌ ዲ አሞር',
    coverImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=500',
    description: 'በፒያሳ እምብርት በሚገኘው ታሪካዊ ካፌ ውስጥ የሚጀምረው የሁለት ወጣቶች ያልተጠበቀ ፍቅር። የጥንቱ ሰፈር ትውስታ እና የዘመኑ የህይወት ትግል ተጋጭተው።',
    descriptionAmh: 'በፒያሳ እምብርት በሚገኘው ታሪካዊ ካፌ ውስጥ የሚጀምረው የሁለት ወጣቶች ያልተጠበቀ ፍቅር። የጥንቱ ሰፈር ትውስታ እና የዘመኑ የህይወት ትግል ተጋጭተው።',
    genres: ['Romance', 'Drama'],
    authorId: 'writer_selam',
    authorName: 'Selamawit Kebede',
    status: 'ongoing',
    views: 8900,
    likes: 620,
    bookmarksCount: 195,
    unlockCount: 120,
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story_3',
    title: 'ቁልፉ',
    coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=500',
    description: 'አንድ ምስጢራዊ ቁልፍ ወደ አባቶቻችን ታላቅ ቅርስ ይወስዳል። ነገር ግን ቁልፉን ለማግኘት የሚደረገው ፍንጭ አደገኛ ገዳዮችንና የመንግስት ምስጢሮችን ያካትታል።',
    descriptionAmh: 'አንድ ምስጢራዊ ቁልፍ ወደ አባቶቻችን ታላቅ ቅርስ ይወስዳል። ነገር ግን ቁልፉን ለማግኘት የሚደረገው ፍንጭ አደገኛ ገዳዮችንና የመንግስት ምስጢሮችን ያካትታል።',
    genres: ['Thriller', 'Mystery', 'Historical'],
    authorId: 'writer_abera',
    authorName: 'Abera Molla',
    status: 'ongoing',
    views: 3100,
    likes: 245,
    bookmarksCount: 88,
    unlockCount: 50,
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story_4',
    title: 'የእኩለ ሌሊት ሹክሹክታ',
    coverImage: 'https://images.unsplash.com/photo-1542204172-e7052809f852?auto=format&fit=crop&q=80&w=500',
    description: 'በእንጦጦ ተራራ እግርጌ በሚገኘው አሮጌ ግቢ ውስጥ በእኩለ ሌሊት የሚሰማው ድምፅ ምስጢር። ስነ-አእምሮአዊ አስፈሪነት እና የአካባቢው አፈ ታరిኮች የተሳሰሩበት።',
    descriptionAmh: 'በእንጦጦ ተራራ እግርጌ በሚገኘው አሮጌ ግቢ ውስጥ በእኩለ ሌሊት የሚሰማው ድምፅ ምስጢር። ስነ-አእምሮአዊ አስፈሪነት እና የአካባቢው አፈ ታሪኮች የተሳሰሩበት።',
    genres: ['Scary Stories', 'Horror', 'Spiritual'],
    authorId: 'writer_selam',
    authorName: 'Selamawit Kebede',
    status: 'ongoing',
    views: 1200,
    likes: 95,
    bookmarksCount: 40,
    unlockCount: 10,
    isApproved: false, // Pending review
    isFeatured: false,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // Story 1: የስደተኛው ማስታወሻ
  {
    id: 'chap_1_1',
    storyId: 'story_1',
    chapterNumber: 1,
    title: 'ምዕራፍ 1: የጉዞው መጀመሪያ',
    content: `በረሃው ገና አልነጋም። አየሩ ብርድ ቢሆንም በልባችን ውስጥ ያለው ፍርሃትና ተስፋ ያሞቀናል። ካሳሁን ሻንጣውን በትከሻው አድርጎ ወደ አሮጌው አይሱዙ መኪና ተጠጋ።
"ሁሉም ሰው ይግባ! ቶሎ በሉ!" የደላላው ድምጽ በሹክሹክታና በጥድፊያ ታጀበ።
ከአዲስ አበባ ተነስተን መተማ እስክንደርስ ድረስ የነበረው ጉዞ አጭር ቢመስልም እውነተኛው ፈተና የሚጀምረው ከዚያ በኋላ እንደሆነ ሁላችንም እናውቃለን። ከእኔ ጋር thirty ሁለት ወጣቶች ነበሩ—ሁላቸውም የተሻለ ህይወት፣ ለቤተሰቦቻቸው የሚሆን ገቢ ፍለጋ የመጡ።
እናቴ ከመውጣቴ በፊት ያለቀሰችው ለቅሶ በአይኔ ላይ ይሽከረከራል። "ልጄ፣ በረሃው ጨካኝ ነው፣ እባክህ ተመለስ" ስትለኝ ምን ያህል እንደታመምኩ የማውቀው እኔ ብቻ ነኝ። ግን ድህነት ከዚያ በረሃ የበለጠ ጨካኝ ነበር።`,
    isLocked: false,
    coinPrice: 0,
    views: 4500,
    likes: 320,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'chap_1_2',
    storyId: 'story_1',
    chapterNumber: 2,
    title: 'ምዕራፍ 2: የአሸዋው ባሕር',
    content: `ሱዳን ድንበር ተሻግረን ወደ ሊቢያ በረሃ ስንገባ አሸዋው ብቻ ሳይሆን አየሩ ራሱ የሚበላ ይመስል ነበር። በየቦታው የተጣሉ ኮንቴይነሮችና ልብሶች አሉ። ጥቂቶቹ ደረቅ አጥንቶችም ሳይቀሩ ከሩቅ ይታያሉ።
ውሃ በሊትር ነበር የሚለካው። በቀን አንድ የተዘጋ የባክ ውሃ ቆብ ብቻ።
"ደላላው አህመድ ውሸታም ነው" አለ ሳሙኤል፣ ከጎኔ የተቀመጠው የጎንደር ልጅ። "በሶስት ቀን ትሪፖሊ ትገባላችሁ ብሎን አሁን ስምንተኛ ቀናችን በበረሃ ላይ።"
ድንገት መኪናው ቆመ። የሞተሩ ድምፅ ሲጠፋ በረሃው ምን ያህል ፀጥተኛና አስፈሪ እንደሆነ ድጋሚ ተረዳን። የአሽከርካሪው ፊት ክፉኛ ተለዋወጠ።
"ውረዱና ግፉ!" ብሎ ጮኸ። ነገር ግን አሸዋው መኪናውን ዋጥ አድርጎታል።`,
    isLocked: false,
    coinPrice: 0,
    views: 3800,
    likes: 290,
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'chap_1_3',
    storyId: 'story_1',
    chapterNumber: 3,
    title: 'ምዕራፍ 3: የመርከቧ ምስጢር (Locked)',
    content: `ባሕሩ አጠገባችን ይገኛል። ትልቅና ሰማያዊ። ነገር ግን የስደት ጉዞ የመጨረሻውና በጣም አስፈሪው ምዕራፍ እዚህ አካባቢ ነው።
"ይህች መርከብ ሰማንያ ሰው ብቻ ነው የምትይዘው" አለ የጥበቃ ሰራተኛው። ነገር ግን በባህር ዳርቻው ላይ ከሁለት መቶ በላይ ሰዎች ተሰብስበው ይጫወታሉ።
ውሃው መርከቧን ሲመታት ታላቅ ድምፅ ያሰማል። ጀልባዋ በፕላስቲክ የተሰራች ሳምቡቅ ነበረች።
ሰዎች እርስ በእርሳቸው እየተገፋፉ መግባት ጀመሩ። ፍርሃቱ ሞትን በቀጥታ ከማየት የመጣ ነው።
"እባካችሁ አትጋፉ!" እያልኩ ስጮህ ድንገት ከኋላዬ የነበረው ወጣት ወደ ባህሩ ወደቀ። ውኃው ጥልቅና ጨለማ ነበር። እጁን ዘርግቶ ሲጮህ በመጨረሻ አሸዋው ብቻ ሳይሆን ውሃውም ሊውጠን እንደመጣ ተገነዘብኩ...`,
    isLocked: true,
    coinPrice: 10,
    views: 1200,
    likes: 180,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'chap_1_4',
    storyId: 'story_1',
    chapterNumber: 4,
    title: 'ምዕራፍ 4: አዲስ የብርሃን ጮራ (Premium Locked)',
    content: `ከባህር አደጋ ተርፈን የጣሊያንን የድንበር ጠባቂ ጀልባ ስናይ ያፈሰስነው እምባ በረሃውንና ባህሩን ያካካሰ ይመስላል። 
የህክምና እርዳታ ተደረገልን። አዲስ አበባ ካለችው እናቴ ጋር በስልክ ስገናኝ የተናገረችው ቃል እስካሁን በጆሮዬ ያቃጭላል፡ "ልጄ በህይወት መኖርህ ብቻ ለእኔ ትልቅ ሀብት ነው"።
አሁን በማስታወሻዬ የምጽፈው ይህ ታሪክ፣ በበረሃና በባህር ለቀሩት ወንድም እህቶቼ መታሰቢያ ይሆን ዘንድ ነው። ህይወት ተስፋ ናት፤ ተስፋ ደግሞ በጭለማ ውስጥ እንኳን የምታበራ ሻማ።`,
    isLocked: true,
    coinPrice: 15,
    views: 800,
    likes: 110,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },

  // Story 2: ካፌ ዲ አሞር
  {
    id: 'chap_2_1',
    storyId: 'story_2',
    chapterNumber: 1,
    title: 'ምዕራፍ 1: የፒያሳ ማኪያቶ',
    content: `ፒያሳ ሁሌም የራሷ የሆነ ዜማ አላት። የታክሲዎቹ ጩኸት፣ የሰዎቹ ጥድፊያ እና የድሮ ህንጻው ግርማ አስደናቂ ናቸው።
ካፌ ዲ አሞር ውስጥ ተቀምጬ ማኪያቶዬን እያማሰልኩ እጠባበቃታለሁ። በፒያሳ አሮጌ ሰፈር ውስጥ የሚገኘው ይህ ካፌ የብዙ ፍቅረኛሞች መገኛ ነው።
በሩ ተከፈተና እሷ ገባች። ሰማያዊ ረጅም ቀሚስ ለብሳለች፣ ፀጉሯ በትከሻዋ ላይ ተዘርግቷል።
"ይቅርታ ይፍርታ ቆየሁብህ?" አለች የልመና በሚመስል ፈገግታ።
"ችግር የለም፣ ለዚህ ፈገግታሽ ሰአታት መጠበቅ እችላለሁ" አልኳት በልበ ሙሉነት። 
ሳቅን። ግን ይህ ሳቃችን አደገኛ የቤተሰብ ምስጢርን እንደደበቀ በወቅቱ አላውቅም ነበር።`,
    isLocked: false,
    coinPrice: 0,
    views: 3200,
    likes: 210,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'chap_2_2',
    storyId: 'story_2',
    chapterNumber: 2,
    title: 'ምዕራፍ 2: የድሮው መጠለያ',
    content: `ዝናቡ ከሰማይ በከፍተኛ ሁኔታ መውረድ ጀመረ። የፒያሳ አስፓልት በውሃ ተጥለቀለቀ። ጃንጥላ ስለሌለን በአቅራቢያችን ወደሚገኝ ጥንታዊ ሰገነት ተጠጋን።
በጣም እየተንቀጠቀጠች ነበር። ጃኬቴን አውልቄ በትከሻዋ ላይ ጣልኩላት።
"አመሰግናለሁ ዮናስ" አለች አይኗን በእኔ ላይ ጥላ። "አባቴ ስለ አንተ በተናገረኝ ቁጥር ፍርሃት ይገባኛል። የእኛ መገናኘት ፈጽሞ መሆን የሌለበት ነገር እንደሆነ ይነግረኛል።"
"ለምን?" አልኳት እጇን ለመያዝ እየሞከርኩ።
"ምክንያቱም አባትህና አባቴ ከሰላሳ አመት በፊት በአንድ ትልቅ ንግድ መቃቃራቸውን... እና አንዱ ሌላኛውን እንዳስወገደው ያምናል።"
ንግግሯ ልክ እንደ እንጦጦ ነፋስ ቀዘቀዘኝ። ታሪካችን የፍቅር ሳይሆን የቂም ሰንሰለት መሆኑን ለማወቅ ጊዜ አስፈለገን።`,
    isLocked: false,
    coinPrice: 0,
    views: 2800,
    likes: 195,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm_1',
    chapterId: 'chap_1_1',
    storyId: 'story_1',
    userName: 'Yared Melaku',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    content: 'በጣም ልብ የሚነካ ጅማሬ ነው! እውነቱን ለመናገር እምባዬን መቆጣጠር አልቻልኩም። በረሃ የረገጡ ወንድሞቻችን በሙሉ በህይወት ይመለሱ።',
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm_2',
    chapterId: 'chap_1_1',
    storyId: 'story_1',
    userName: 'Selamawit Kebede',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    content: 'ደራሲ አበራ እጅግ ድንቅ በሆነ አቀራረብ ጀምረኸዋል። የምዕራፍ ሁለት ጥበቃ ላይ ነኝ!',
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm_3',
    chapterId: 'chap_2_1',
    storyId: 'story_2',
    userName: 'Yared Melaku',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    content: 'የፒያሳ ፍቅር ልዩ ነው። የዮናስና የእሷ ፍቅር ወዴት እንደሚሄድ ለማየት ጓጉቻለሁ።',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const GENRE_LIST = [
  'Romance',
  'Adult',
  'Thriller',
  'Mystery',
  'Comedy',
  'Spiritual',
  'Horror',
  'Scary Stories',
  'Adventure',
  'Historical',
  'True Stories / Fact Based',
  'Drama',
  'Crime',
  'Fantasy',
  'Poet'
];

export const COIN_PACKAGES = [
  { coins: 20, price: 20, description: 'Starter Pack / የጀማሪዎች ጥቅል' },
  { coins: 50, price: 50, description: 'Popular Choice / የተሻለ ምርጫ' },
  { coins: 110, price: 100, description: 'Value Pack (+10 bonus) / ትርፍ ጥቅል' },
  { coins: 300, price: 250, description: 'Super Saver (+50 bonus) / ድንቅ ቅናሽ' },
  { coins: 650, price: 500, description: 'Max Value (+150 bonus) / ከፍተኛ ጥቅል' }
];

export const TELEBIRR_MERCHANT_NUMBER = '0987654321'; // App Owner's receiving Telebirr
