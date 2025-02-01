<template>
  <div 
    class="min-h-screen relative overflow-hidden transition-colors duration-300"
    :style="{
      '--btn-bg': currentTheme.btnBg,
      '--accent-color': currentTheme.accentColor,
      '--text-color': currentTheme.textColor,
      '--muted-text-color': currentTheme.mutedTextColor,
      '--highlight-color': currentTheme.highlightColor,
      '--border-color': currentTheme.borderColor,
      background: isCloudyNoRain ? currentTheme.bgGradient : (isSunny && isDaytime ? 'linear-gradient(to right, #1CB5E0, #000046)' : currentTheme.bgGradient)
    }"
  >
    <!-- Background GIF -->
    <div 
      class="absolute inset-0 w-full h-full transition-all duration-1000"
      :style="{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <!-- Simple stars effect (only shows during clear nights) -->
      <div v-if="isNightClear" class="stars-container">
        <div 
          v-for="(star, index) in stars" 
          :key="index"
          class="star"
          :style="{
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay
          }"
        ></div>
      </div>

      <!-- Overlay for better readability -->
      <div class="absolute inset-0 bg-black/30"></div>
    </div>

    <!-- Animated Background -->
    <div 
      v-if="!isCloudyNoRain"
      class="absolute inset-0 animate-gradient bg-gradient-to-r"
      :style="{
        backgroundImage: currentTheme.bgGradient,
        backgroundSize: '200% 200%'
      }"
    ></div>

    <!-- Rain Effect -->
    <div class="rain"></div>

    <!-- Main Content with added top margin -->
    <div class="relative z-10 p-8 pt-24">
      <div class="max-w-5xl mx-auto animate-fadeIn">
        <!-- Title Section -->
        <div class="text-center mb-12">
          <h1 
            ref="titleRef"
            class="text-3xl sm:text-4xl font-extrabold mb-2 inline-block"
            :style="{ color: 'var(--text-color)' }"
          >
            <span class="inline-block" v-for="(letter, index) in 'Weatherino'" :key="index">
              {{ letter }}
            </span>
          </h1>
          <p 
            ref="subtitleRef"
            class="text-base sm:text-lg font-semibold"
            :style="{ color: 'var(--muted-text-color)' }"
          >
            Check the weather anywhere in the world
          </p>
        </div>

        <!-- Enhanced Search Bar with Autocomplete -->
        <CitySearch 
          :current-theme="currentTheme"
          :API_KEY="API_KEY"
          @select-city="handleCitySelect"
        />

        <!-- Enhanced Weather Display -->
        <div v-if="weatherData" class="space-y-6">
          <!-- Main Weather Card -->
          <div 
            class="backdrop-blur-sm rounded-2xl p-6 sm:p-8 border animate-slideUp transition-colors duration-300"
            :class="[currentTheme.weatherCardClass, currentTheme.borderColor]"
          >
            <div class="flex justify-between items-start">
              <div>
                <h2 :class="[currentTheme.mainTextClass, 'text-3xl sm:text-4xl font-bold']">
                  {{ weatherData.name }}, {{ weatherData.sys.country }}
                </h2>
                <p :class="[currentTheme.secondaryTextClass, 'mt-1 text-lg']">
                  {{ formatLocationTime(locationTime) }}
                </p>
              </div>
              <div class="text-right">
                <div :class="[currentTheme.mainTextClass, 'text-5xl sm:text-6xl font-extrabold flex items-start justify-end']">
                  {{ Math.round(weatherData.main.temp) }}
                  <span class="text-3xl sm:text-4xl">°C</span>
                </div>
                <div class="flex items-center justify-end gap-2 mt-2">
                  <img 
                    :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" 
                    :alt="weatherData.weather[0].description"
                    class="w-12 sm:w-16 h-12 sm:h-16 animate-float"
                  >
                  <p :class="[currentTheme.mainTextClass, 'text-lg sm:text-xl font-bold capitalize']">
                    {{ weatherData.weather[0].description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Temperature Range -->
            <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/5 rounded-lg">
              <div class="flex flex-col gap-2">
                <div :class="[currentTheme.mainTextClass, 'flex justify-between items-center text-xs sm:text-sm font-bold']">
                  <span>{{ Math.round(weatherData.main.temp_min) }}°C</span>
                  <span>Current: {{ Math.round(weatherData.main.temp) }}°C</span>
                  <span>{{ Math.round(weatherData.main.temp_max) }}°C</span>
                </div>
                <div class="h-2 bg-white/10 rounded-full overflow-hidden relative">
                  <!-- Background gradient -->
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 opacity-30"></div>
                  <!-- Temperature indicator -->
                  <div 
                    class="absolute h-full w-2 bg-white rounded-full transition-all duration-300 shadow-lg"
                    :style="{
                      left: `${((weatherData.main.temp - weatherData.main.temp_min) / 
                               (weatherData.main.temp_max - weatherData.main.temp_min)) * 100}%`,
                      transform: 'translateX(-50%)'
                    }"
                  ></div>
                  <!-- Temperature range fill -->
                  <div 
                    class="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    :style="{
                      width: `${((weatherData.main.temp - weatherData.main.temp_min) / 
                                (weatherData.main.temp_max - weatherData.main.temp_min)) * 100}%`
                    }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-white/40">
                  <span>Min</span>
                  <span>Max</span>
                </div>
              </div>
            </div>

            <!-- Detailed Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <!-- Feels Like -->
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="p-3 sm:p-4 rounded-full bg-white/5">
                  <svg :class="[currentTheme.mainTextClass, 'w-5 sm:w-6 h-5 sm:h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                </div>
                <div>
                  <p :class="[currentTheme.mainTextClass, 'text-sm sm:text-base font-bold']">Feels Like</p>
                  <p :class="[currentTheme.mainTextClass, 'text-xl sm:text-2xl font-extrabold']">
                    {{ Math.round(weatherData.main.feels_like) }}°C
                  </p>
                </div>
              </div>

              <!-- Humidity -->
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="p-3 sm:p-4 rounded-full bg-white/5">
                  <svg :class="[currentTheme.mainTextClass, 'w-5 sm:w-6 h-5 sm:h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                  </svg>
                </div>
                <div>
                  <p :class="[currentTheme.mainTextClass, 'text-sm sm:text-base font-bold']">Humidity</p>
                  <p :class="[currentTheme.mainTextClass, 'text-xl sm:text-2xl font-extrabold']">
                    {{ weatherData.main.humidity }}%
                  </p>
                </div>
              </div>

              <!-- Wind -->
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="p-3 sm:p-4 rounded-full bg-white/5">
                  <svg :class="[currentTheme.mainTextClass, 'w-5 sm:w-6 h-5 sm:h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </div>
                <div>
                  <p :class="[currentTheme.mainTextClass, 'text-sm sm:text-base font-bold']">Wind</p>
                  <p :class="[currentTheme.mainTextClass, 'text-xl sm:text-2xl font-extrabold']">
                    {{ Math.round(weatherData.wind.speed) }} m/s
                  </p>
                </div>
              </div>

              <!-- Pressure -->
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="p-3 sm:p-4 rounded-full bg-white/5">
                  <svg :class="[currentTheme.mainTextClass, 'w-5 sm:w-6 h-5 sm:h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
                  </svg>
                </div>
                <div>
                  <p :class="[currentTheme.mainTextClass, 'text-sm sm:text-base font-bold']">Pressure</p>
                  <p :class="[currentTheme.mainTextClass, 'text-xl sm:text-2xl font-extrabold']">
                    {{ weatherData.main.pressure }} hPa
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Forecast Button -->
          <button 
            @click="toggleForecast"
            class="mt-6 w-full p-4 rounded-lg border transition-all duration-300 
                   flex items-center justify-center gap-2 hover:scale-[1.02] font-bold
                   backdrop-blur-md"
            :style="{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: currentTheme.textColor,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }"
            :class="{
              'hover:bg-white/20': true
            }"
          >
            <span>5-Day Forecast</span>
            <svg 
              class="w-5 h-5 transform transition-transform duration-300 ease-in-out"
              :class="{ 'rotate-180': showForecast }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- 5-Day Forecast -->
          <div 
            v-if="showForecast && forecastData" 
            class="mt-6 space-y-4 animate-slideDown"
          >
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div 
                v-for="(day, index) in processedForecastData" 
                :key="day.dt"
                class="backdrop-blur-sm rounded-xl p-4 border border-white/20
                       transform transition-all duration-300 hover:scale-105"
                :class="currentTheme.weatherCardClass"
                :style="{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.5s ease-out forwards'
                }"
              >
                <div class="text-center">
                  <p class="text-sm text-white/60 font-bold">
                    {{ formatDate(day.dt) }}
                  </p>
                  <img 
                    :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" 
                    :alt="day.weather[0].description"
                    class="w-16 h-16 mx-auto"
                  >
                  <p class="text-2xl font-extrabold">
                    {{ Math.round(day.temp) }}°C
                  </p>
                  <p class="text-sm capitalize font-bold">
                    {{ day.weather[0].description }}
                  </p>
                  <div class="mt-2 text-sm text-white/60">
                    <p>H: {{ Math.round(day.temp_max) }}°C</p>
                    <p>L: {{ Math.round(day.temp_min) }}°C</p>
                  </div>
                  <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p class="text-white/60">Humidity</p>
                      <p>{{ day.humidity }}%</p>
                    </div>
                    <div>
                      <p class="text-white/60">Wind</p>
                      <p>{{ Math.round(day.wind_speed) }} m/s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Weather Info -->
          <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
            <!-- Wind Info -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 class="text-lg font-semibold mb-4">Wind</h3>
              <div class="space-y-2">
                <p class="text-2xl">{{ weatherData.wind.speed }} m/s</p>
                <p class="text-sm text-white/60">{{ getWindDescription(weatherData.wind.speed) }}</p>
                <p class="text-sm text-white/60">Direction: {{ getWindDirection(weatherData.wind.deg) }}</p>
                <p v-if="weatherData.wind.gust" class="text-sm text-white/60">
                  Gusts up to {{ weatherData.wind.gust }} m/s
                </p>
              </div>
            </div>
          </div>
          <p :class="[currentTheme.mainTextClass, 'mt-4 text-sm']">
            Last updated: {{ formatLastUpdated(weatherData.dt) }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center animate-shake">
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Add this inside your template, after the background div and before the main content -->
    <div class="weather-effects">
      <!-- Sun Animation -->
      <div v-if="isSunny && isDaytime" class="sun-container">
        <svg class="sun-svg" viewBox="-100 -100 200 200">
          <!-- Sun Core -->
          <circle 
            class="sun-core" 
            cx="0" 
            cy="0" 
            r="60"
            fill="url(#sunGradient)"
          />
          
          <!-- Single Sun Rays Circle -->
          <circle 
            cx="0" 
            cy="0" 
            r="75" 
            class="ray-circle"
            fill="none"
            stroke="#ffd700"
            stroke-width="7"
            stroke-dasharray="2 8"
            stroke-linecap="round"
            pathLength="100"
            transform="rotate(90)"
          />
          
          <!-- Gradient Definitions -->
          <defs>
            <radialGradient id="sunGradient">
              <stop offset="0%" stop-color="#fff500"/>
              <stop offset="100%" stop-color="#ffd700"/>
            </radialGradient>
          </defs>
        </svg>
        
        <!-- Heat Waves -->
        <div class="heat-waves">
          <div class="wave-container">
            <div class="heat-wave"></div>
          </div>
        </div>
      </div>

      <!-- Moon Animation -->
      <div v-if="isClearNight" class="moon-container">
        <svg class="moon-svg" viewBox="-100 -100 200 200">
          <!-- Moon -->
          <circle 
            class="moon-core" 
            cx="0" 
            cy="0" 
            r="60"
            fill="url(#moonGradient)"
          />
          
          <!-- Moon craters for detail -->
          <circle cx="-20" cy="-20" r="12" fill="rgba(200, 200, 200, 0.2)"/>
          <circle cx="25" cy="10" r="15" fill="rgba(200, 200, 200, 0.2)"/>
          <circle cx="-25" cy="30" r="10" fill="rgba(200, 200, 200, 0.2)"/>
          
          <!-- Gradient Definitions -->
          <defs>
            <radialGradient id="moonGradient">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#e6e6e6"/>
            </radialGradient>
          </defs>
        </svg>
        
        <!-- Moon glow effect -->
        <div class="moon-glow"></div>
      </div>
    </div>

    <!-- Add this after the sun container and before the main content -->
    <div v-if="shouldShowRain" class="weather-effects">
      <!-- Rain drops -->
      <div class="rain-container">
        <div v-for="n in 100" :key="n" 
          class="rain-drop"
          :style="{
            '--delay': `${Math.random() * 2}s`,
            '--duration': `${0.5 + Math.random() * 0.5}s`,
            '--left': `${Math.random() * 100}%`
          }"
        ></div>
      </div>
    </div>
    <!--added-->
    <!-- Update the cloudy effects section -->
    <div v-if="isCloudyWeather" class="smoky-effects">
      <svg class="smoke-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <!-- Smoke gradient -->
          <linearGradient id="smokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(255,255,255,0.1)"/>
            <stop offset="100%" style="stop-color:rgba(255,255,255,0)"/>
          </linearGradient>
          
          <!-- Smoke filter -->
          <filter id="smokeFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="5" seed="1" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G"/>
            <feGaussianBlur stdDeviation="5" result="blur"/>
          </filter>
        </defs>

        <!-- Smoke paths -->
        <g class="smoke-group">
          <path class="smoke-path smoke1" d="M300,1000 Q400,900 300,800 Q200,700 300,600 Q400,500 300,400 Q200,300 300,200 Q400,100 300,0" 
                fill="url(#smokeGradient)" filter="url(#smokeFilter)"/>
          <path class="smoke-path smoke2" d="M600,1000 Q700,900 600,800 Q500,700 600,600 Q700,500 600,400 Q500,300 600,200 Q700,100 600,0"
                fill="url(#smokeGradient)" filter="url(#smokeFilter)"/>
          <path class="smoke-path smoke3" d="M900,1000 Q1000,900 900,800 Q800,700 900,600 Q1000,500 900,400 Q800,300 900,200 Q1000,100 900,0"
                fill="url(#smokeGradient)" filter="url(#smokeFilter)"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import anime from 'animejs'
import CitySearch from './components/CitySearch.vue'

const API_KEY = '7a79c11bfaf7a01b08314bd79c4d12f3'
const searchQuery = ref('')
const weatherData = ref(null)
const error = ref(null)
const suggestions = ref([])
const showSuggestions = ref(true)
const activeIndex = ref(0)
const isLoading = ref(false)
const showForecast = ref(false)
const forecastData = ref(null)
const currentTime = ref('')
const titleRef = ref(null)
const subtitleRef = ref(null)
let debounceTimeout = null

// Update the themes object with darker blues
const themes = {
  sunny: {
    gradient: { start: '#0B95C9', middle: '#0B95C9', end: '#000033' },
    button: '#0B95C9',
    accent: '#0B95C9',
    text: '#ffffff',
    mutedText: 'rgba(255, 255, 255, 0.7)',
    highlight: '#0B95C9',
    border: '#0B95C980',
    weatherCardClass: 'from-blue-600/20 to-blue-900/20',
    mainTextClass: 'text-white',
    secondaryTextClass: 'text-white/60',
    bgGradient: 'linear-gradient(to right, #0B95C9, #000033)'
  },
  cloudy: {
    gradient: { start: '#64748b', middle: '#475569', end: '#334155' },
    button: '#94a3b8',
    accent: '#cbd5e1',
    text: '#f8fafc',
    mutedText: 'rgba(248, 250, 252, 0.7)',
    highlight: '#e2e8f0',
    border: '#94a3b880',
    weatherCardClass: 'from-gray-500/20 to-gray-800/20',
    mainTextClass: 'text-white',
    secondaryTextClass: 'text-white/60'
  },
  rainy: {
    gradient: { 
      start: '#020617',  // Much darker blue
      middle: '#0f172a', // Very dark blue
      end: '#1e293b'     // Dark blue
    },
    button: '#0284c7',
    accent: '#38bdf8',
    text: '#f0f9ff',
    mutedText: 'rgba(240, 249, 255, 0.7)',
    highlight: '#7dd3fc',
    border: '#0284c780',
    weatherCardClass: 'from-blue-900/30 to-blue-950/30',
    mainTextClass: 'text-white',
    secondaryTextClass: 'text-white/60',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)'
  },
  snow: {
    gradient: { start: '#e2e8f0', middle: '#cbd5e1', end: '#94a3b8' },
    button: '#64748b',
    accent: '#f1f5f9',
    text: '#1e293b',
    mutedText: 'rgba(30, 41, 59, 0.7)',
    highlight: '#f8fafc',
    border: '#64748b80',
    weatherCardClass: 'from-gray-200/20 to-gray-400/20',
    mainTextClass: 'text-gray-900',
    secondaryTextClass: 'text-gray-900/60'
  },
  thunder: {
    gradient: { start: '#6b21a8', middle: '#581c87', end: '#3b0764' },
    button: '#7e22ce',
    accent: '#a855f7',
    text: '#faf5ff',
    mutedText: 'rgba(250, 245, 255, 0.7)',
    highlight: '#d8b4fe',
    border: '#7e22ce80',
    weatherCardClass: 'from-purple-500/20 to-purple-800/20',
    mainTextClass: 'text-white',
    secondaryTextClass: 'text-white/60'
  },
  mist: {
    gradient: { start: '#9ca3af', middle: '#6b7280', end: '#4b5563' },
    button: '#6b7280',
    accent: '#d1d5db',
    text: '#f9fafb',
    mutedText: 'rgba(249, 250, 251, 0.7)',
    highlight: '#e5e7eb',
    border: '#6b728080',
    weatherCardClass: 'from-gray-400/20 to-gray-600/20',
    mainTextClass: 'text-white',
    secondaryTextClass: 'text-white/60'
  },
  night: {
    gradient: { start: '#1e1b4b', middle: '#0f172a', end: '#020617' },
    button: '#1e293b',
    accent: '#334155',
    text: '#f8fafc',
    mutedText: 'rgba(248, 250, 252, 0.7)',
    highlight: '#94a3b8',
    border: '#1e293b80',
    weatherCardClass: 'from-gray-800/20 to-gray-900/20',
    mainTextClass: 'text-white',
    secondaryTextClass: 'text-white/60'
  }
}

// Update the default theme to match
const defaultTheme = {
  name: 'sunny',
  btnBg: '#0B95C9',
  accentColor: '#0B95C9',
  textColor: '#ffffff',
  mutedTextColor: 'rgba(255, 255, 255, 0.7)',
  highlightColor: '#0B95C9',
  borderColor: '#0B95C980',
  weatherCardClass: 'from-blue-600/20 to-blue-900/20',
  mainTextClass: 'text-white',
  secondaryTextClass: 'text-white/60',
  bgGradient: 'linear-gradient(to right, #0B95C9, #000033)'
}

// Initialize currentTheme with default values
const currentTheme = ref(defaultTheme)

const getWeatherTheme = (weatherData) => {
  if (!weatherData) return 'sunny'

  const weatherId = weatherData.weather[0].id
  const isNight = weatherData.weather[0].icon?.includes('n')

  if (weatherId === 800 && isNight) return 'night'
  if (weatherId === 800) return 'sunny'
  if (weatherId >= 200 && weatherId < 300) return 'thunder'
  if ((weatherId >= 300 && weatherId < 400) || 
      (weatherId >= 500 && weatherId < 600)) return 'rainy'
  if (weatherId >= 600 && weatherId < 700) return 'snow'
  if (weatherId >= 700 && weatherId < 800) return 'mist'
  if (weatherId > 800) return 'cloudy'

  return 'sunny'
}

const updateTheme = (themeName) => {
  const themeColors = themes[themeName]
  currentTheme.value = {
    name: themeName,
    btnBg: themeColors.button,
    accentColor: themeColors.accent,
    textColor: themeColors.text,
    mutedTextColor: themeColors.mutedText,
    highlightColor: themeColors.highlight,
    borderColor: themeColors.border,
    weatherCardClass: themeColors.weatherCardClass,
    mainTextClass: themeColors.mainTextClass,
    secondaryTextClass: themeColors.secondaryTextClass,
    bgGradient: `linear-gradient(135deg, ${themeColors.gradient.start} 20%, ${themeColors.gradient.middle} 50%, ${themeColors.gradient.end} 80%)`
  }
}

// Watch for weather changes and update theme
watch(() => weatherData.value, (newWeatherData) => {
  if (newWeatherData) {
    const themeName = getWeatherTheme(newWeatherData)
    updateTheme(themeName)
  }
}, { immediate: true })

// Enhanced debounced search with multilingual support
const debouncedSearch = () => {
  clearTimeout(debounceTimeout)
  if (searchQuery.value.length < 2) {
    suggestions.value = []
    isLoading.value = false
    return
  }

  isLoading.value = true
  debounceTimeout = setTimeout(async () => {
    try {
      // Split query and normalize unicode characters
      const [cityQuery, countryQuery] = searchQuery.value
        .normalize('NFKC')
        .split(',')
        .map(part => part.trim())
      
      // Get user's browser language for local names
      const userLang = navigator.language || navigator.userLanguage
      
      // Make multiple API calls for better coverage
      const [directResults, localResults] = await Promise.all([
        // Search with direct query
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityQuery}&limit=25&appid=${API_KEY}`),
        // Search with local names
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityQuery}&limit=25&appid=${API_KEY}&lang=${userLang}`)
      ])
      
      if (!directResults.ok || !localResults.ok) throw new Error('Failed to fetch suggestions')
      
      const directData = await directResults.json()
      const localData = await localResults.json()
      
      // Combine and deduplicate results
      const combinedResults = [...directData, ...localData]
      const uniqueResults = Array.from(new Map(
        combinedResults.map(item => [`${item.lat}-${item.lon}`, item])
      ).values())
      
      // Enhanced filtering and sorting with multilingual support
      suggestions.value = uniqueResults
        .filter(item => {
          const searchTerms = [
            item.name,
            item.local_names?.[userLang],
            item.local_names?.en,
            item.state,
            item.country
          ].filter(Boolean).map(term => term.toLowerCase())
          
          const queryLower = cityQuery.toLowerCase()
          
          // If country is specified, filter by it
          if (countryQuery) {
            const countryMatch = 
              item.country.toLowerCase().includes(countryQuery.toLowerCase()) ||
              Object.values(item.local_names || {})
                .some(name => name.toLowerCase().includes(countryQuery.toLowerCase()))
            if (!countryMatch) return false
          }
          
          // Match any of the name variants
          return searchTerms.some(term => term.includes(queryLower))
        })
        .sort((a, b) => {
          const getRelevanceScore = (item) => {
            const names = [
              item.name,
              item.local_names?.[userLang],
              item.local_names?.en
            ].filter(Boolean)
            
            const queryLower = cityQuery.toLowerCase()
            let score = 0
            
            // Exact match in any language
            if (names.some(name => name.toLowerCase() === queryLower)) score += 100
            // Starts with query in any language
            else if (names.some(name => name.toLowerCase().startsWith(queryLower))) score += 50
            // Contains query in any language
            else if (names.some(name => name.toLowerCase().includes(queryLower))) score += 25
            
            // Boost score for matches in user's language
            if (item.local_names?.[userLang]?.toLowerCase().includes(queryLower)) score += 10
            
            return score
          }
          
          return getRelevanceScore(b) - getRelevanceScore(a)
        })
        .map(item => ({
          ...item,
          // Show local name if available, fallback to default name
          displayName: item.local_names?.[userLang] || item.name,
          highlightedName: highlightMatch(
            item.local_names?.[userLang] || item.name,
            cityQuery
          )
        }))

      showSuggestions.value = true
      activeIndex.value = 0
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      suggestions.value = []
    } finally {
      isLoading.value = false
    }
  }, 300)
}

// Enhanced highlight match function with unicode support
const highlightMatch = (text, query) => {
  if (!query) return text
  const escapedQuery = query
    .normalize('NFKC')
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<mark class="bg-blue-500/30 rounded px-1">$1</mark>')
}

// Handle keyboard navigation
const handleArrowDown = () => {
  if (activeIndex.value < suggestions.value.length - 1) {
    activeIndex.value++
  }
}

const handleArrowUp = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

// Handle suggestion selection
const selectSuggestion = (suggestion) => {
  if (!suggestion) return
  
  searchQuery.value = `${suggestion.displayName}, ${suggestion.country}`
  showSuggestions.value = false
  getWeather(suggestion.lat, suggestion.lon)
}

// Enhanced getWeather function
const getWeather = async (lat, lon) => {
  if (!searchQuery.value && !lat) return

  try {
    error.value = null
    forecastData.value = null
    showSuggestions.value = false
    isLoading.value = true

    let url
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery.value}&units=metric&appid=${API_KEY}`
    }

    const response = await fetch(url)
    if (!response.ok) throw new Error('City not found')
    
    const data = await response.json()
    weatherData.value = data
  } catch (err) {
    error.value = err.message
    weatherData.value = null
  } finally {
    isLoading.value = false
  }
}

// Close suggestions when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-container')) {
    showSuggestions.value = false
  }
}

// Add and remove click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  updateCurrentTime() // Initial update
  const timer = setInterval(updateCurrentTime, 1000)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    clearInterval(timer)
  })
  
  animateTitle()
})

// Utility functions for new features
const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

const getWindDescription = (speed) => {
  if (speed < 0.5) return 'Calm'
  if (speed < 1.5) return 'Light Air'
  if (speed < 3.3) return 'Light Breeze'
  if (speed < 5.5) return 'Gentle Breeze'
  if (speed < 7.9) return 'Moderate Breeze'
  if (speed < 10.7) return 'Fresh Breeze'
  if (speed < 13.8) return 'Strong Breeze'
  return 'High Wind'
}

// Fixed forecast function
const toggleForecast = async () => {
  showForecast.value = !showForecast.value
  
  if (showForecast.value && weatherData.value) {
    try {
      isLoading.value = true
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.value.coord.lat}&lon=${weatherData.value.coord.lon}&units=metric&appid=${API_KEY}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch forecast')
      
      const data = await response.json()
      forecastData.value = data
    } catch (err) {
      console.error('Error fetching forecast:', err)
      error.value = 'Failed to load forecast data'
      showForecast.value = false
    } finally {
      isLoading.value = false
    }
  }
}

// Format date for forecast
const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

// Add this computed property in the script section
const processedForecastData = computed(() => {
  if (!forecastData.value) return []

  // Group forecasts by day
  const dailyForecasts = forecastData.value.list.reduce((acc, forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(forecast)
    return acc
  }, {})

  // Process each day's forecasts
  return Object.entries(dailyForecasts)
    .slice(0, 5) // Get only first 5 days
    .map(([date, forecasts]) => {
      // Calculate average/min/max values for the day
      const temps = forecasts.map(f => f.main.temp)
      const humidity = Math.round(
        forecasts.reduce((sum, f) => sum + f.main.humidity, 0) / forecasts.length
      )
      const windSpeed = forecasts.reduce((sum, f) => sum + f.wind.speed, 0) / forecasts.length

      // Use the middle of the day forecast for weather description and icon
      const midDayForecast = forecasts[Math.floor(forecasts.length / 2)]

      return {
        dt: forecasts[0].dt,
        temp: Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length),
        temp_min: Math.round(Math.min(...temps)),
        temp_max: Math.round(Math.max(...temps)),
        humidity,
        wind_speed: windSpeed,
        weather: midDayForecast.weather,
      }
    })
})

// Format the last updated time
const formatLastUpdated = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString()
}

// Update current time
const updateCurrentTime = () => {
  currentTime.value = new Date().toLocaleString()
}

// Add these computed properties to the script section
const userLanguage = computed(() => navigator.language || navigator.userLanguage)

const getLocalName = (suggestion, lang) => {
  if (!suggestion.local_names) return null
  return suggestion.local_names[lang] || 
         suggestion.local_names[lang.split('-')[0]] || 
         null
}

// Add animation function
const animateTitle = () => {
  const container = titleRef.value;
  const subtitle = subtitleRef.value;
  
  const weatherIcon = document.createElement('div');
  weatherIcon.className = 'weather-icon';
  container.insertBefore(weatherIcon, container.firstChild);

  // Hide all title letters and subtitle initially
  container.querySelectorAll('span').forEach(span => {
    span.style.opacity = '0';
    span.style.display = 'none';
  });
  subtitle.style.opacity = '0';

  weatherIcon.innerHTML = `
    <div class="weather-element">
      <svg class="weather-svg" viewBox="0 0 100 100">
        <!-- Sun elements -->
        <g class="sun-group" opacity="0">
          <circle class="sun-core" cx="50" cy="50" r="20"/>
          <g class="sun-rays">
            ${Array.from({length: 12}, (_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x1 = 50 + Math.cos(angle) * 25;
              const y1 = 50 + Math.sin(angle) * 25;
              const x2 = 50 + Math.cos(angle) * 35;
              const y2 = 50 + Math.sin(angle) * 35;
              return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
            }).join('')}
          </g>
        </g>

        <!-- Cloud and Storm elements -->
        <g class="cloud-group" opacity="0">
          <path class="cloud-path" d="M25,60 Q25,50 35,50 Q35,35 50,35 Q65,35 65,50 Q75,50 75,60 Q75,70 65,70 Q65,70 35,70 Q25,70 25,60"/>
          <g class="rain-drops" opacity="0">
            ${Array.from({length: 5}, (_, i) => `
              <line class="rain-line" x1="${30 + i * 10}" y1="70" x2="${25 + i * 10}" y2="85"/>
            `).join('')}
          </g>
        </g>
      </svg>
    </div>
  `;

  // Animation sequence
  anime.timeline({
    easing: 'easeInOutQuad',
  })
  // Sun animation
  .add({
    targets: '.sun-group',
    opacity: [0, 1],
    scale: [0.5, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .8)',
    complete: () => {
      anime({
        targets: '.sun-rays',
        rotateZ: 360,
        duration: 2000,
        loop: true,
        easing: 'linear'
      });
    }
  })
  // Transition to cloud
  .add({
    targets: '.sun-group',
    opacity: 0,
    scale: 0.5,
    duration: 400,
    easing: 'easeInOutSine'
  })
  .add({
    targets: '.cloud-group',
    opacity: [0, 1],
    scale: [0.5, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .8)',
    complete: () => {
      anime({
        targets: '.cloud-group',
        translateY: [-2, 2],
        duration: 1000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });
    }
  })
  // Add rain to cloud
  .add({
    targets: '.rain-drops',
    opacity: 1,
    duration: 400,
    easing: 'easeInOutSine',
    complete: () => {
      anime({
        targets: '.rain-line',
        translateY: [0, 15],
        opacity: [1, 0],
        duration: 500,
        loop: true,
        delay: anime.stagger(100),
        easing: 'easeInOutSine'
      });
    }
  })
  // Final transition to title
  .add({
    delay: 1000,
    targets: '.weather-icon',
    opacity: 0,
    scale: 0.8,
    duration: 400,
    easing: 'easeInOutSine',
    complete: () => {
      weatherIcon.remove();
      container.querySelectorAll('span').forEach(span => {
        span.style.display = 'inline-block';
      });
      anime({
        targets: container.querySelectorAll('span'),
        opacity: [0, 1],
        translateY: [-20, 0],
        scale: [0.9, 1],
        delay: anime.stagger(100, { from: 'center' }),
        duration: 1200,
        easing: 'easeOutElastic(1, .8)',
        complete: () => {
          // Animate subtitle after title animation completes
          anime({
            targets: subtitle,
            opacity: [0, 1],
            translateY: [-10, 0],
            duration: 800,
            easing: 'easeOutQuad'
          });
        }
      });
    }
  });
}

// Add handleSearch function
const handleSearch = () => {
  if (suggestions.value.length > 0) {
    selectSuggestion(suggestions.value[activeIndex.value])
  } else if (searchQuery.value.trim()) {
    // If no suggestions but there's a query, try direct search
    getWeather()
  }
}

// Add this function to format date and time
const formatDateTime = (timestamp, showDate) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  
  if (showDate) {
    // Full format for desktop: "Monday, January 1, 2024 3:45 PM"
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else {
    // Time only format for mobile: "3:45 PM"
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

const handleCitySelect = async (city) => {
  try {
    error.value = null
    weatherData.value = null
    showForecast.value = false  // Reset forecast state
    forecastData.value = null
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
    )
    
    if (!response.ok) throw new Error('City not found')
    const data = await response.json()
    weatherData.value = data
    
  } catch (err) {
    error.value = err.message
  }
}

// Import all GIFs from assets
const weatherBackgrounds = {
  sunny: {
    day: new URL('../assets/weather-gifs/sunny-day.gif', import.meta.url).href,
    night: new URL('../assets/weather-gifs/clear-night.gif', import.meta.url).href
  },
  cloudy: new URL('../assets/weather-gifs/cloudy.gif', import.meta.url).href,
  rainy: new URL('../assets/weather-gifs/rain.gif', import.meta.url).href,
  snow: new URL('../assets/weather-gifs/snow.gif', import.meta.url).href,
  thunder: new URL('../assets/weather-gifs/thunder.gif', import.meta.url).href,
  mist: new URL('../assets/weather-gifs/mist.gif', import.meta.url).href
}

// Update the background logic
const currentBackground = computed(() => {
  if (!weatherData.value) return weatherBackgrounds.sunny.day

  const weatherId = weatherData.value.weather[0].id
  const isNight = weatherData.value.weather[0].icon?.includes('n')

  // Clear sky
  if (weatherId === 800) {
    return isNight ? weatherBackgrounds.sunny.night : weatherBackgrounds.sunny.day
  }
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return weatherBackgrounds.thunder
  }
  
  // Drizzle and Rain
  if ((weatherId >= 300 && weatherId < 400) || 
      (weatherId >= 500 && weatherId < 600)) {
    return weatherBackgrounds.rainy
  }
  
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return weatherBackgrounds.snow
  }
  
  // Atmosphere (mist, fog, etc)
  if (weatherId >= 700 && weatherId < 800) {
    return weatherBackgrounds.mist
  }
  
  // Clouds
  if (weatherId > 800) {
    return weatherBackgrounds.cloudy
  }

  return weatherBackgrounds.sunny.day
})

// Add a computed property to check if it's night and clear
const isNightClear = computed(() => {
  if (!weatherData.value) return false
  return weatherData.value.weather[0].id === 800 && 
         weatherData.value.weather[0].icon?.includes('n')
})

// Generate random star positions
const generateStars = (count) => {
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`
  }))
}

const stars = ref(generateStars(200)) // Generate 200 stars

// Add these computed properties to your script section
const isSunny = computed(() => {
  if (!weatherData.value) return false
  return weatherData.value.weather[0].id === 800
})

const isDaytime = computed(() => {
  if (!weatherData.value) return true
  return !weatherData.value.weather[0].icon?.includes('n')
})

// Update the formatting function to only show time
const formatLocationTime = (date) => {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

// Keep the locationTime computed property as is
const locationTime = computed(() => {
  if (!weatherData.value) return new Date();
  
  // Get location timezone offset in seconds
  const timezone = weatherData.value.timezone;
  
  // Create date using location's timezone
  const localTime = new Date();
  const utc = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
  return new Date(utc + (1000 * timezone));
});

// Update the isCloudyNoRain computed property
const isCloudyWeather = computed(() => {
  if (!weatherData.value) return false;
  const weatherId = weatherData.value.weather[0].id;
  
  // Include all cloud conditions (801-804)
  // and atmosphere conditions (701-781: mist, smoke, haze, fog, etc.)
  return (weatherId >= 801 && weatherId <= 804) || 
         (weatherId >= 701 && weatherId <= 781);
});

// Update the shouldShowRain computed property
const shouldShowRain = computed(() => {
  if (!weatherData.value) return false;
  
  const weatherId = weatherData.value.weather[0].id;
  
  return (weatherId >= 300 && weatherId < 532) || // Drizzle and Rain
         (weatherId >= 200 && weatherId < 300);    // Thunderstorm
});

// Update the isClearNight computed property
const isClearNight = computed(() => {
  if (!weatherData.value) return false;
  const weatherId = weatherData.value.weather[0].id;
  const isNight = weatherData.value.weather[0].icon?.includes('n');
  return weatherId === 800 && isNight;
});
</script>

<style>
/* Theme Transition */
.theme-transition {
  @apply transition-all duration-300;
}

/* Rain Effect */
.rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 2px 2px;
  animation: rainAnimation 0.5s linear infinite;
}

@keyframes rainAnimation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100px 100px;
  }
}

/* Scrollbar Styling for Search Suggestions */
.search-container::-webkit-scrollbar {
  width: 8px;
}

.search-container::-webkit-scrollbar-thumb {
  background-color: black;
  border-radius: 4px;
}

.search-container::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Existing styles... */

/* Update title animation styles */
h1 span {
  display: inline-block;
  opacity: 0;
  transform-origin: center;
}

/* Add button hover effect */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Add theme-specific transitions */
.transition-theme {
  transition: color 0.3s ease, background-color 0.3s ease;
}

/* Update placeholder colors for different themes */
.placeholder-text-white\/60::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.placeholder-text-black\/60::placeholder {
  color: rgba(0, 0, 0, 0.6);
}

/* Weather Icon Container */
.weather-icon {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 60px;
  margin: 0 auto;
}

.weather-element {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* SVG Icons */
.weather-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Cloud Styles */
.cloud-path {
  fill: none;
  stroke: #fff;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Sun Styles */
.sun-group {
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Storm Styles */
.bolt {
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Rain Styles */
.rain-drops {
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Title container */
h1 {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Title letters */
h1 span {
  display: none;
  opacity: 0;
  transform-origin: center;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: gradient 15s ease infinite;
}

.waves {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

@keyframes swell {
  0%, 100% { transform: translate3d(0, -25px, 0); }
  50% { transform: translate3d(0, 5px, 0); }
}

/* Add smooth transitions between backgrounds */
.absolute {
  transition: background-image 1s ease-in-out;
}

/* Stars Animation */
.stars-container {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: white;
  border-radius: 50%;
  opacity: 0.8;
  animation: twinkle 1.5s infinite ease-in-out alternate;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.6);
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Add these new styles to your style section */
.weather-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

/* Sun Container */
.sun-container {
  position: fixed;
  pointer-events: none;
  overflow: hidden;
  z-index: 2;
}

/* Default (mobile) positioning */
@media (max-width: 768px) {
  .sun-container {
    top: -120px;
    left: -120px;
    width: 300px;
    height: 300px;
  }
}

/* Desktop positioning */
@media (min-width: 769px) {
  .sun-container {
    top: -180px;
    left: -180px;
    width: 400px;
    height: 400px;
  }
}

/* Sun SVG Styles */
.sun-svg {
  width: 100%;
  height: 100%;
  animation: sunPulse 4s ease-in-out infinite;
}

.sun-core {
  filter: drop-shadow(0 0 8px #ffd700);
}

/* Ray Styles */
.sun-rays .ray {
  fill: none;
  stroke: #ffd700;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 8 2;
}

.rays-long {
  animation: rayRotate 20s linear infinite;
}

.rays-medium {
  animation: rayRotate 15s linear infinite reverse;
}

/* Heat Waves */
.heat-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
}

.wave-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.heat-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: heatWave 3s ease-out infinite;
  animation-delay: var(--delay);
}

/* Animations */
@keyframes sunPulse {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
}

@keyframes heatWave {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

/* Simplify the Ray Styles */
.ray-circle {
  transform-origin: 0 0;
  opacity: 0.8;
  animation: rayRotate 20s linear infinite;
}

@keyframes rayRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Cloud and Rain Effects */
.weather-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.rain-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.rain-drop {
  position: absolute;
  top: 0;
  left: var(--left);
  width: 1px;
  height: 20px;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.7));
  animation: rainFall var(--duration) linear infinite;
  animation-delay: var(--delay);
}

@keyframes rainFall {
  0% {
    transform: translateY(0) skewX(-15deg);
    opacity: 0;
  }
  5% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) skewX(-15deg);
    opacity: 0.3;
  }
}

/* Moon styles */
.moon-container {
  position: fixed;
  top: 40px;
  right: 40px;
  width: 120px;
  height: 120px;
  z-index: 1;
}

.moon-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
  animation: moonFloat 6s ease-in-out infinite;
}

.moon-core {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

.moon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  z-index: -1;
}

@keyframes moonFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Cloudy weather styles */
.smoky-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.smoke-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.smoke-path {
  opacity: 0.4;
  transform-origin: center;
}

.smoke1 {
  animation: smokeAnimation 20s ease-out infinite;
}

.smoke2 {
  animation: smokeAnimation 20s ease-out infinite;
  animation-delay: -6s;
}

.smoke3 {
  animation: smokeAnimation 20s ease-out infinite;
  animation-delay: -12s;
}

@keyframes smokeAnimation {
  0% {
    transform: translateY(10%) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(-10%) scale(1.5);
    opacity: 0;
  }
}

/* Add dynamic turbulence */
.smoke-group {
  animation: turbulence 30s ease-in-out infinite;
}

@keyframes turbulence {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, 5px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  75% {
    transform: translate(-10px, 10px);
  }
}
</style>