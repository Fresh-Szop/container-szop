/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
    	extend: {
    		width: {
    			'128': '128rem'
    		},
    		maxWidth: {
    			'128': '128rem',
    			image: '40rem'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	},
    	colors: {
    		'white': '#ffffff',
    		'black': '#000000',
    		'malachite': {
    			'0': '#e6f2e7',
    			'1': '#cce2cd',
    			'2': '#b0ceb1',
    			'3': '#8db88f',
    			'4': '#5d9862',
    			'5': '#437047',
    			'6': '#315134',
    			'7': '#2a412b',
    			'8': '#233324',
    			'9': '#1b241c'
    		},
    		'verdigris': {
    			'0': '#daf5f5',
    			'1': '#bfe3e3',
    			'2': '#a1cece',
    			'3': '#78b8b9',
    			'4': '#2d999b',
    			'5': '#1f7072',
    			'6': '#1a5152',
    			'7': '#174243',
    			'8': '#133434',
    			'9': '#102626'
    		},
    		'desertsand': {
    			'0': '#f6ece7',
    			'1': '#e7d7cd',
    			'2': '#d5bfb2',
    			'3': '#c2a491',
    			'4': '#a67e64',
    			'5': '#7a5c48',
    			'6': '#584235',
    			'7': '#47372c',
    			'8': '#362b24',
    			'9': '#27201c'
    		},
    		'flame': {
    			'0': '#fceae4',
    			'1': '#f2d3c8',
    			'2': '#e4b9aa',
    			'3': '#d69b86',
    			'4': '#be7055',
    			'5': '#8c513d',
    			'6': '#653b2d',
    			'7': '#513126',
    			'8': '#3d2820',
    			'9': '#2b1e1a'
    		},
    		'persianred': {
    			'0': '#ffe8e7',
    			'1': '#f9cfce',
    			'2': '#edb3b2',
    			'3': '#e29291',
    			'4': '#cc6265',
    			'5': '#974749',
    			'6': '#6d3435',
    			'7': '#572c2d',
    			'8': '#422424',
    			'9': '#2d1c1c'
    		},
    		'blood': {
    			'0': '#ffe7ea',
    			'1': '#fbcdd3',
    			'2': '#f0b0b9',
    			'3': '#e68e9b',
    			'4': '#d15b73',
    			'5': '#9b4153',
    			'6': '#6f303c',
    			'7': '#592a32',
    			'8': '#432328',
    			'9': '#2e1c1e'
    		},
    		'solidred': {
    			'0': '#ffe8e3',
    			'1': '#fccec7',
    			'2': '#f1b2a8',
    			'3': '#e79083',
    			'4': '#d35e50',
    			'5': '#9c4439',
    			'6': '#70322a',
    			'7': '#5a2b25',
    			'8': '#44241f',
    			'9': '#2f1c19'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
}

