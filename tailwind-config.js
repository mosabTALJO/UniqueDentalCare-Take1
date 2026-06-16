tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#005FC6', // Primary Accent Blue
                accent: '#32CCC1', // Teal/Turquoise Accent
                light: '#FFFFFF', // Primary Backgrounds/Neutrals
                dark: '#0B3C5D', // Dark slate/navy
            },
            fontFamily: {
                sans: ['Inter', 'Montserrat', 'sans-serif'],
                serif: ['Inter', 'Montserrat', 'sans-serif'],
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out both',
                'fade-in': 'fadeIn 1.2s ease-out both',
            }
        }
    }
}
