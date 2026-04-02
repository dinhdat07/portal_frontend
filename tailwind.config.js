export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                ink: '#13212E',
                paper: '#F6F8FB',
                panel: '#FFFFFF',
                mist: '#E6EBF2',
                teal: {
                    50: '#E8F7F5',
                    100: '#D3F0EC',
                    500: '#17867D',
                    600: '#126B64',
                    700: '#0C4E49',
                },
                cobalt: {
                    100: '#DAE6FF',
                    500: '#356AE6',
                    600: '#2856BF',
                },
                success: '#15803D',
                warning: '#B45309',
                danger: '#C2410C',
            },
            fontFamily: {
                sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
                display: ['"Sora"', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                panel: '0 12px 40px rgba(19, 33, 46, 0.08)',
            },
            borderRadius: {
                xl: '1rem',
            },
            backgroundImage: {
                hero: 'radial-gradient(circle at top left, rgba(23,134,125,0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(53,106,230,0.18), transparent 30%)',
            },
        },
    },
    plugins: [],
};
