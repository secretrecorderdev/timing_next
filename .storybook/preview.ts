import type { Preview } from '@storybook/nextjs-vite';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#ffffff' },
        { name: 'slate', value: '#0f172a' },
        { name: 'gray', value: '#f3f4f6' },
      ],
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
