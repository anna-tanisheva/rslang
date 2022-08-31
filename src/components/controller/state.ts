import {
    IAppState,
    // IStatisticState,
    ICurrentGame,
    ITextbookState,
} from "../../typings/typings";

export const ENDPOINT = "http://localhost:3000";

export const appState: IAppState = {
    isSignedIn: false,
    user: {
        userId: "",
        name: "",
        token: "",
        refreshToken: "",
        statsToday: {
            statisticTimeStamp: null,
            statisticState: {
                total: {
                    correctAnswersPercent: 0,
                    wordsLearntArr: [],
                    wordsLearnt: 0,
                    correctAnswers: 0,
                    correctAnswersStrick: 0,
                },
                audioCall: {
                    correctAnswersPercent: 0,
                    numberOfGames: 0,
                    wordsLearntArr: [],
                    wordsLearnt: 0,
                    correctAnswers: 0,
                    correctAnswersStrick: 0,
                },
                sprint: {
                    correctAnswersPercent: 0,
                    numberOfGames: 0,
                    wordsLearntArr: [],
                    wordsLearnt: 0,
                    correctAnswers: 0,
                    correctAnswersStrick: 0
                },
            }
        }
    },
    viewsStates: {
        textbook: {
            group: 0,
            page: 0,
        },
    },
    view: "index",
    userNull: {
        statisticTimeStamp: null,
        statisticState: {
            total: {
                correctAnswersPercent: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
            },
            audioCall: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
            },
            sprint: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0
            },
        }
    },
    usersStats: []
};

export const textbookState: ITextbookState = {
    words: [],
};

export const TEXTBOOK_GROUP_COUNT = 6;
export const TEXTBOOK_GROUP_SIZE = 600;
export const TEXTBOOK_PAGE_COUNT = 30;
export const WORDS_IN_GAME = 10;

export const currentGame: ICurrentGame = {game: null};

export const audio = new Audio();

export const KEYBOARD_CODES = ['1', '2', '3', '4', 'Enter', 'ArrowRight'];

export const ARR_OF_WORDS_FOR_TEST = {
      "words": [
          {
              "_id": "5e9f5ee35eb9e72bc21af5ea",
              "group": 0,
              "page": 16,
              "word": "forward",
              "image": "files/17_0331.jpg",
              "audio": "files/17_0331.mp3",
              "audioMeaning": "files/17_0331_meaning.mp3",
              "audioExample": "files/17_0331_example.mp3",
              "textMeaning": "If you move <i>forward</i>, you move in the direction in front of you.",
              "textExample": "When he saw his mother, the baby crawled <b>forward</b> to her.",
              "transcription": "[fɔ́ːrwəːrd]",
              "textExampleTranslate": "Когда он увидел свою мать, малыш пополз к ней вперед",
              "textMeaningTranslate": "Если вы двигаетесь вперед, вы двигаетесь в направлении перед вами",
              "wordTranslate": "вперед",
              "id": "5e9f5ee35eb9e72bc21af5ea"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af5f6",
              "group": 0,
              "page": 17,
              "word": "banana",
              "image": "files/18_0343.jpg",
              "audio": "files/18_0343.mp3",
              "audioMeaning": "files/18_0343_meaning.mp3",
              "audioExample": "files/18_0343_example.mp3",
              "textMeaning": "A <i>banana</i> is a long yellow fruit with soft white flesh inside.",
              "textExample": "Did you eat a <b>banana</b> for breakfast?",
              "transcription": "[bənǽnə]",
              "textExampleTranslate": "Ты ел банан на завтрак?",
              "textMeaningTranslate": "Банан - это длинный желтый фрукт с мягкой белой мякотью внутри",
              "wordTranslate": "банан",
              "id": "5e9f5ee35eb9e72bc21af5f6"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af609",
              "group": 0,
              "page": 18,
              "word": "bone",
              "image": "files/19_0362.jpg",
              "audio": "files/19_0362.mp3",
              "audioMeaning": "files/19_0362_meaning.mp3",
              "audioExample": "files/19_0362_example.mp3",
              "textMeaning": "A <i>bone</i> is a hard part of the body.",
              "textExample": "I brought home a nice <b>bone</b> for my dog.",
              "transcription": "[boun]",
              "textExampleTranslate": "Я принес домой хорошую собаку для моей собаки",
              "textMeaningTranslate": "Кость - это твердая часть тела",
              "wordTranslate": "кость",
              "id": "5e9f5ee35eb9e72bc21af609"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af61b",
              "group": 0,
              "page": 18,
              "word": "wood",
              "image": "files/19_0380.jpg",
              "audio": "files/19_0380.mp3",
              "audioMeaning": "files/19_0380_meaning.mp3",
              "audioExample": "files/19_0380_example.mp3",
              "textMeaning": "<i>Wood</i> is the thing that trees are made of.",
              "textExample": "I put the pieces of <b>wood</b> in a pile.",
              "transcription": "[wud]",
              "textExampleTranslate": "Я положил кусочки дерева в кучу",
              "textMeaningTranslate": "Дерево - это то, из чего сделаны деревья",
              "wordTranslate": "дерево",
              "id": "5e9f5ee35eb9e72bc21af61b"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af625",
              "group": 0,
              "page": 19,
              "word": "goal",
              "image": "files/20_0390.jpg",
              "audio": "files/20_0390.mp3",
              "audioMeaning": "files/20_0390_meaning.mp3",
              "audioExample": "files/20_0390_example.mp3",
              "textMeaning": "A <i>goal</i> is something you work toward.",
              "textExample": "Her <b>goal</b> was to become a doctor.",
              "transcription": "[goul]",
              "textExampleTranslate": "Ее целью было стать врачом",
              "textMeaningTranslate": "Цель - это то, ради чего ты работаешь",
              "wordTranslate": "цель",
              "id": "5e9f5ee35eb9e72bc21af625"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af626",
              "group": 0,
              "page": 19,
              "word": "lie",
              "image": "files/20_0391.jpg",
              "audio": "files/20_0391.mp3",
              "audioMeaning": "files/20_0391_meaning.mp3",
              "audioExample": "files/20_0391_example.mp3",
              "textMeaning": "To <i>lie</i> is to say or write something untrue to deceive someone.",
              "textExample": "Whenever Pinocchio <b>lied</b> to his father, his nose grew.",
              "transcription": "[lai]",
              "textExampleTranslate": "Всякий раз, когда Пиноккио лгал своему отцу, его нос рос",
              "textMeaningTranslate": "Лгать - значит говорить или писать что-то неправдивое, чтобы кого-то обмануть",
              "wordTranslate": "ложь",
              "id": "5e9f5ee35eb9e72bc21af626"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af4a1",
              "group": 0,
              "page": 0,
              "word": "agree",
              "image": "files/01_0001.jpg",
              "audio": "files/01_0001.mp3",
              "audioMeaning": "files/01_0001_meaning.mp3",
              "audioExample": "files/01_0001_example.mp3",
              "textMeaning": "To <i>agree</i> is to have the same opinion or belief as another person.",
              "textExample": "The students <b>agree</b> they have too much homework.",
              "transcription": "[əgríː]",
              "textExampleTranslate": "Студенты согласны, что у них слишком много домашней работы",
              "textMeaningTranslate": "Согласиться - значит иметь то же мнение или убеждение, что и другой человек",
              "wordTranslate": "согласна",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 6,
                          "rightAnswer": 4,
                          "rightAnswerSeries": 4
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af4a1"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af4d7",
              "group": 0,
              "page": 2,
              "word": "solve",
              "image": "files/03_0056.jpg",
              "audio": "files/03_0056.mp3",
              "audioMeaning": "files/03_0056_meaning.mp3",
              "audioExample": "files/03_0056_example.mp3",
              "textMeaning": "To <i>solve</i> something is to find an answer to it.",
              "textExample": "All the students could easily <b>solve</b> the math problem.",
              "transcription": "[sɑlv]",
              "textExampleTranslate": "Все ученики могли легко решить математическую задачу",
              "textMeaningTranslate": "Решить что-то - значит найти ответ",
              "wordTranslate": "решать",
              "id": "5e9f5ee35eb9e72bc21af4d7"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af4eb",
              "group": 0,
              "page": 3,
              "word": "represent",
              "image": "files/04_0076.jpg",
              "audio": "files/04_0076.mp3",
              "audioMeaning": "files/04_0076_meaning.mp3",
              "audioExample": "files/04_0076_example.mp3",
              "textMeaning": "To <i>represent</i> is to speak or act for a person or group.",
              "textExample": "My lawyer will <b>represent</b> me in court.",
              "transcription": "[rèprizént]",
              "textExampleTranslate": "Мой адвокат будет представлять меня в суде",
              "textMeaningTranslate": "Представлять - значит говорить или действовать от лица или группы",
              "wordTranslate": "представлять",
              "id": "5e9f5ee35eb9e72bc21af4eb"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af4fe",
              "group": 0,
              "page": 4,
              "word": "increase",
              "image": "files/05_0095.jpg",
              "audio": "files/05_0095.mp3",
              "audioMeaning": "files/05_0095_meaning.mp3",
              "audioExample": "files/05_0095_example.mp3",
              "textMeaning": "To <i>increase</i> is to make something larger.",
              "textExample": "I will <b>increase</b> my score if I study for the test.",
              "transcription": "[inkríːs]",
              "textExampleTranslate": "Я увеличу свой счет, если я буду готовиться к экзамену",
              "textMeaningTranslate": "Увеличить значит сделать что-то большее",
              "wordTranslate": "увеличение",
              "id": "5e9f5ee35eb9e72bc21af4fe"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af501",
              "group": 0,
              "page": 4,
              "word": "often",
              "image": "files/05_0098.jpg",
              "audio": "files/05_0098.mp3",
              "audioMeaning": "files/05_0098_meaning.mp3",
              "audioExample": "files/05_0098_example.mp3",
              "textMeaning": "<i>Often</i> is when something happens many times.",
              "textExample": "He <b>often</b> goes to bed early during the week.",
              "transcription": "[ɔ́ːfən]",
              "textExampleTranslate": "Он часто ложится спать рано в течение недели",
              "textMeaningTranslate": "Часто бывает, когда что-то случается много раз",
              "wordTranslate": "довольно часто",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 1,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af501"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af51f",
              "group": 0,
              "page": 6,
              "word": "difference",
              "image": "files/07_0128.jpg",
              "audio": "files/07_0128.mp3",
              "audioMeaning": "files/07_0128_meaning.mp3",
              "audioExample": "files/07_0128_example.mp3",
              "textMeaning": "A <i>difference</i> is a way that something is not like other things.",
              "textExample": "The biggest <b>difference</b> between the birds is the color of their feathers.",
              "transcription": "[dífərəns]",
              "textExampleTranslate": "Самая большая разница между птицами - это цвет их перьев",
              "textMeaningTranslate": "Разница - это то, что что-то не так, как другие",
              "wordTranslate": "разница",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 1,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af51f"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af53f",
              "group": 0,
              "page": 7,
              "word": "theory",
              "image": "files/08_0160.jpg",
              "audio": "files/08_0160.mp3",
              "audioMeaning": "files/08_0160_meaning.mp3",
              "audioExample": "files/08_0160_example.mp3",
              "textMeaning": "A <i>theory</i> is an idea about how something works.",
              "textExample": "We talked about Einstein’s <b>theory</b> of relativity in class.",
              "transcription": "[θíːəri]",
              "textExampleTranslate": "Мы говорили о теории относительности Эйнштейна в классе",
              "textMeaningTranslate": "Теория - это идея о том, как что-то работает",
              "wordTranslate": "теория",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 1,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af53f"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af54b",
              "group": 0,
              "page": 8,
              "word": "hospital",
              "image": "files/09_0172.jpg",
              "audio": "files/09_0172.mp3",
              "audioMeaning": "files/09_0172_meaning.mp3",
              "audioExample": "files/09_0172_example.mp3",
              "textMeaning": "A <i>hospital</i> is where sick or hurt people receive care or treatment.",
              "textExample": "The doctor talks to a patient at the <b>hospital</b>.",
              "transcription": "[hάspitl]",
              "textExampleTranslate": "Доктор разговаривает с пациентом в больнице",
              "textMeaningTranslate": "Больница - это место, где больные или пострадавшие получают помощь или лечение",
              "wordTranslate": "больница",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 1,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af54b"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af54e",
              "group": 0,
              "page": 8,
              "word": "open",
              "image": "files/09_0175.jpg",
              "audio": "files/09_0175.mp3",
              "audioMeaning": "files/09_0175_meaning.mp3",
              "audioExample": "files/09_0175_example.mp3",
              "textMeaning": "To <i>open</i> is to move something so that an opening is not covered.",
              "textExample": "Amy likes to <b>open</b> the window to let fresh air in.",
              "transcription": "[óupən]",
              "textExampleTranslate": "Эми нравится открывать окно, чтобы впустить свежий воздух",
              "textMeaningTranslate": "Открыть - это переместить что-то, чтобы отверстие не закрылось",
              "wordTranslate": "открытый",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 2,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af54e"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af553",
              "group": 0,
              "page": 8,
              "word": "service",
              "image": "files/09_0180.jpg",
              "audio": "files/09_0180.mp3",
              "audioMeaning": "files/09_0180_meaning.mp3",
              "audioExample": "files/09_0180_example.mp3",
              "textMeaning": "<i>Service</i> is the act of helping or serving someone.",
              "textExample": "This coffee shop has excellent <b>service</b>.",
              "transcription": "[sə́ːrvis]",
              "textExampleTranslate": "В этой кофейне отличный сервис",
              "textMeaningTranslate": "Служба - это акт помощи или служения кому-либо",
              "wordTranslate": "служба",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 2,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af553"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af557",
              "group": 0,
              "page": 9,
              "word": "chance",
              "image": "files/10_0183.jpg",
              "audio": "files/10_0183.mp3",
              "audioMeaning": "files/10_0183_meaning.mp3",
              "audioExample": "files/10_0183_example.mp3",
              "textMeaning": "A <i>chance</i> is an opportunity to do something.",
              "textExample": "I had a <b>chance</b> to see the Coliseum in Rome last summer.",
              "transcription": "[tʃæns]",
              "textExampleTranslate": "У меня был шанс увидеть Колизей в Риме прошлым летом",
              "textMeaningTranslate": "Шанс есть возможность что-то сделать",
              "wordTranslate": "шанс",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 1,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af557"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af559",
              "group": 0,
              "page": 9,
              "word": "certain",
              "image": "files/10_0182.jpg",
              "audio": "files/10_0182.mp3",
              "audioMeaning": "files/10_0182_meaning.mp3",
              "audioExample": "files/10_0182_example.mp3",
              "textMeaning": "If you are <i>certain</i> about something, you know it is true.",
              "textExample": "I am <b>certain</b> that zebras have stripes.",
              "transcription": "[sə́ːrtən]",
              "textExampleTranslate": "Я уверен, что у зебр есть полоски",
              "textMeaningTranslate": "Если вы уверены в чем-то, вы знаете, что это правда",
              "wordTranslate": "определенный",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 2,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af559"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af59a",
              "group": 0,
              "page": 12,
              "word": "found",
              "image": "files/13_0251.jpg",
              "audio": "files/13_0251.mp3",
              "audioMeaning": "files/13_0251_meaning.mp3",
              "audioExample": "files/13_0251_example.mp3",
              "textMeaning": "To <i>found</i> a company or organization means to start it.",
              "textExample": "The Pilgrims <b>founded</b> one of the first colonies in the United States.",
              "transcription": "[faund]",
              "textExampleTranslate": "Паломники основали одну из первых колоний в Соединенных Штатах",
              "textMeaningTranslate": "Учредить компанию или организацию - значит начать ее",
              "wordTranslate": "нашел",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 2,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af59a"
          },
          {
              "_id": "5e9f5ee35eb9e72bc21af5a9",
              "group": 0,
              "page": 13,
              "word": "exam",
              "image": "files/14_0265.jpg",
              "audio": "files/14_0265.mp3",
              "audioMeaning": "files/14_0265_meaning.mp3",
              "audioExample": "files/14_0265_example.mp3",
              "textMeaning": "An <i>exam</i> is a test.",
              "textExample": "I did some practice questions for the math <b>exam</b> on the board.",
              "transcription": "[igzǽm]",
              "textExampleTranslate": "Я сделал несколько практических вопросов для экзамена по математике на доске",
              "textMeaningTranslate": "Экзамен - это тест",
              "wordTranslate": "экзамен",
              "userWord": {
                  "difficulty": "norm",
                  "optional": {
                      "audiocall": {
                          "countGames": 1,
                          "rightAnswer": 1,
                          "rightAnswerSeries": 1
                      },
                      "sprint": {
                          "countGames": 0,
                          "rightAnswer": 0,
                          "rightAnswerSeries": 0
                      }
                  }
              },
              "id": "5e9f5ee35eb9e72bc21af5a9"
          }
      ]
    }