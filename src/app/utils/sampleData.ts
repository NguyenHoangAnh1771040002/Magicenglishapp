export const sampleVocabulary = [
  {
    id: "1",
    word: "Persevere",
    ipa: "/ˌpɜː.sɪˈvɪər/",
    meaning: "Kiên trì, bền bỉ, không bỏ cuộc",
    partOfSpeech: "verb",
    example: "Despite many setbacks, she persevered and eventually achieved her goals.",
    cefrLevel: "B2",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    word: "Benevolent",
    ipa: "/bəˈnev.əl.ənt/",
    meaning: "Nhân từ, rộng lượng, có lòng thương người",
    partOfSpeech: "adjective",
    example: "He was a benevolent old man and wouldn't hurt a fly.",
    cefrLevel: "C1",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    word: "Eloquent",
    ipa: "/ˈel.ə.kwənt/",
    meaning: "Hùng hồn, có tài hùng biện, diễn đạt trôi chảy",
    partOfSpeech: "adjective",
    example: "She gave an eloquent speech about climate change that moved the audience.",
    cefrLevel: "C1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    word: "Ameliorate",
    ipa: "/əˈmiː.li.ə.reɪt/",
    meaning: "Cải thiện, làm cho tốt hơn",
    partOfSpeech: "verb",
    example: "The new policies were designed to ameliorate living conditions in the city.",
    cefrLevel: "C2",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    word: "Diligent",
    ipa: "/ˈdɪl.ɪ.dʒənt/",
    meaning: "Cần cù, siêng năng, chăm chỉ",
    partOfSpeech: "adjective",
    example: "She is a diligent student who always completes her homework on time.",
    cefrLevel: "B2",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    word: "Abundant",
    ipa: "/əˈbʌn.dənt/",
    meaning: "Dồi dào, phong phú, nhiều",
    partOfSpeech: "adjective",
    example: "The region has abundant natural resources.",
    cefrLevel: "B1",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
];

export function initializeSampleData() {
  const hasData = localStorage.getItem("magicEnglishVocab");
  const hasInitialized = localStorage.getItem("magicEnglishSampleDataLoaded");

  // Only load sample data if user has no data and hasn't explicitly dismissed it
  if (!hasData && !hasInitialized) {
    // Ask user if they want sample data
    return true;
  }
  return false;
}

export function loadSampleData() {
  localStorage.setItem("magicEnglishVocab", JSON.stringify(sampleVocabulary));
  localStorage.setItem("magicEnglishSampleDataLoaded", "true");
  
  // Set a streak of 5 days for demo purposes
  localStorage.setItem("currentStreak", "5");
  localStorage.setItem("lastStudyDate", new Date().toDateString());
}

export function skipSampleData() {
  localStorage.setItem("magicEnglishSampleDataLoaded", "true");
}
