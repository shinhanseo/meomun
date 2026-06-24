import { create } from 'zustand';

import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type { SelectedPlaceInput } from '../types/record.types';

interface RecordWriteState {
  title: string;
  place: SelectedPlaceInput | null;
  emotion: EmotionCode | null;
  content: string;

  setTitle: (title: string) => void;
  setPlace: (place: SelectedPlaceInput | null) => void;
  setEmotion: (emotion: EmotionCode | null) => void;
  setContent: (content: string) => void;
  resetDraft: () => void;
}

const initialState = {
  title: '',
  place: null,
  emotion: null,
  content: '',
};

export const useRecordWriteStore = create<RecordWriteState>((set) => ({
  ...initialState,

  setTitle: (title) => {
    set({ title });
  },

  setPlace: (place) => {
    set({ place });
  },

  setEmotion: (emotion) => {
    set({ emotion });
  },

  setContent: (content) => {
    set({ content });
  },

  resetDraft: () => {
    set(initialState);
  },
}));