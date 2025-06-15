
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				futuristic: ['Orbitron', 'Space Grotesk', 'sans-serif'],
				space: ['Space Grotesk', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Warm and comfortable color scheme
				sage: {
					50: '#f6f8f6',
					100: '#e3e8e3',
					200: '#c7d2c7',
					300: '#9fb09f',
					400: '#718871',
					500: '#5a6f5a',
					600: '#475947',
					700: '#3a483a',
					800: '#2f3c2f',
					900: '#283228',
				},
				azure: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
				},
				lavender: {
					50: '#faf7ff',
					100: '#f4edff',
					200: '#ebe0ff',
					300: '#d9c7ff',
					400: '#c2a1ff',
					500: '#a67cff',
					600: '#9333ea',
					700: '#7c2d7c',
					800: '#6b246b',
					900: '#581c58',
				},
				amber: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				},
				// Dark theme colors - warmer and softer
				dark: {
					bg: '#0f0f14',
					surface: '#1a1a22',
					elevated: '#252530',
					accent: '#2d2d3a',
				},
				// Neutral colors with better contrast
				neutral: {
					white: '#ffffff',
					light: '#f8fafc',
					medium: '#94a3b8',
					gray: '#64748b',
					dark: '#334155',
				},
				// Glass effects with warmer tones
				glass: {
					light: 'rgba(255, 255, 255, 0.08)',
					medium: 'rgba(255, 255, 255, 0.12)',
					dark: 'rgba(0, 0, 0, 0.25)',
				}
			},
			backdropBlur: {
				'xs': '2px',
				'4xl': '72px',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'gentle-fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.98)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'soft-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(166, 124, 255, 0.2)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(166, 124, 255, 0.4)'
					}
				},
				'warm-pulse': {
					'0%, 100%': {
						textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
					},
					'50%': {
						textShadow: '0 0 20px rgba(245, 158, 11, 0.8)'
					}
				},
				'gentle-float': {
					'0%, 100%': {
						transform: 'translateY(0) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-6px) rotate(1deg)'
					}
				},
				'symbol-drift': {
					'0%': {
						transform: 'translateX(0px) translateY(0px)'
					},
					'50%': {
						transform: 'translateX(10px) translateY(-5px)'
					},
					'100%': {
						transform: 'translateX(0px) translateY(0px)'
					}
				},
				'wave-motion': {
					'0%, 100%': {
						transform: 'translateX(-50%) skewX(-2deg)'
					},
					'50%': {
						transform: 'translateX(50%) skewX(2deg)'
					}
				},
				'grid-breathe': {
					'0%, 100%': {
						opacity: '0.3'
					},
					'50%': {
						opacity: '0.5'
					}
				},
				'particle-dance': {
					'0%, 100%': {
						opacity: '0.4',
						transform: 'scale(0.9)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gentle-fade-in': 'gentle-fade-in 1.2s ease-out',
				'soft-glow': 'soft-glow 4s ease-in-out infinite',
				'warm-pulse': 'warm-pulse 3s ease-in-out infinite',
				'gentle-float': 'gentle-float 8s ease-in-out infinite',
				'symbol-drift': 'symbol-drift 12s ease-in-out infinite',
				'wave-motion': 'wave-motion 20s ease-in-out infinite',
				'grid-breathe': 'grid-breathe 6s ease-in-out infinite',
				'particle-dance': 'particle-dance 3s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
