import { IAppState, ICurrentGame, ITextbookState } from '../../typings/typings';

export const ENDPOINT = 'https://react-rslang-be-wkho.onrender.com';

export const appState: IAppState = {
  isSignedIn: false,
  user: {
    userId: '',
    name: '',
    token: '',
    refreshToken: '',
    statsToday: {
      statisticTimeStamp: null,
      statisticState: {
        total: {
          newWords: 0,
          correctAnswersPercent: 0,
          numberOfGames: 0,
          wordsLearntArr: [],
          wordsLearnt: 0,
          correctAnswers: 0,
          correctAnswersStrick: 0,
        },
        audioCall: {
          newWords: 0,
          correctAnswersPercent: 0,
          numberOfGames: 0,
          wordsLearntArr: [],
          wordsLearnt: 0,
          correctAnswers: 0,
          correctAnswersStrick: 0,
        },
        sprint: {
          newWords: 0,
          correctAnswersPercent: 0,
          numberOfGames: 0,
          wordsLearntArr: [],
          wordsLearnt: 0,
          correctAnswers: 0,
          correctAnswersStrick: 0,
        },
      },
    },
  },
  viewsStates: {
    textbook: {
      mode: 'textbook',
      dictionaryMode: 'hard',
      group: 0,
      page: 0,
    },
  },
  view: 'index',
  userNull: {
    statisticTimeStamp: null,
    statisticState: {
      total: {
        newWords: 0,
        correctAnswersPercent: 0,
        numberOfGames: 0,
        wordsLearntArr: [],
        wordsLearnt: 0,
        correctAnswers: 0,
        correctAnswersStrick: 0,
        totalAnswers: 0,
      },
      audioCall: {
        newWords: 0,
        correctAnswersPercent: 0,
        numberOfGames: 0,
        wordsLearntArr: [],
        wordsLearnt: 0,
        correctAnswers: 0,
        correctAnswersStrick: 0,
        totalAnswers: 0,
      },
      sprint: {
        newWords: 0,
        correctAnswersPercent: 0,
        numberOfGames: 0,
        wordsLearntArr: [],
        wordsLearnt: 0,
        correctAnswers: 0,
        correctAnswersStrick: 0,
        totalAnswers: 0,
      },
    },
  },
  usersStats: [],
};

export const textbookState: ITextbookState = {
  words: [],
};

export const TEXTBOOK_GROUP_COUNT = 6;
export const TEXTBOOK_GROUP_SIZE = 600;
export const TEXTBOOK_PAGE_COUNT = 30;

export const AUDIO_CALL = 'audioCall';
export const SPRINT = 'sprint';

export const currentGame: ICurrentGame = { game: null };

export const audio = new Audio();

export const KEYBOARD_CODES = ['1', '2', '3', '4', 'Enter', 'ArrowRight'];

export const COLORS = [
  '#00cc87',
  '#ffae1a',
  '#ff8da1',
  '#ff6666',
  '#87cefa',
  '#8080ff',
];
