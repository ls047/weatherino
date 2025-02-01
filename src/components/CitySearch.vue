<template>
  <div class="search-container relative max-w-md mx-auto my-4 z-50">
    <div class="relative flex items-center">
      <div class="relative w-full">
        <input
          v-model="query"
          @input="handleSearchInput"
          @keyup.enter="triggerSearch"
          type="text"
          placeholder="Search for a city..."
          aria-label="City search input"
          class="w-full px-4 py-2 pr-12 rounded-lg bg-white/10 backdrop-blur-md border border-white/20
                 focus:outline-none focus:border-white/40"
          :class="[currentTheme.mainTextClass]"
          :style="{
            borderColor: 'var(--border-color)',
            color: currentTheme.textColor,
            '::placeholder': { color: currentTheme.placeholderColor }
          }"
        />
        
        <!-- Clear button -->
        <button 
          v-if="query"
          @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 
                 hover:opacity-80 transition-opacity duration-200
                 focus:outline-none"
          aria-label="Clear search"
          :style="{ color: currentTheme.textColor }"
        >
          <i class="fas fa-times-circle text-lg"></i>
        </button>
      </div>
      
      <!-- Search Button -->
      <button
        @click="triggerSearch"
        aria-label="Search cities"
        class="ml-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20
               hover:bg-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/30
               active:bg-white/30 transition-all duration-200 ease-in-out group flex items-center gap-1 sm:px-4 sm:py-2 sm:gap-2"
        :class="[currentTheme.mainTextClass]"
      >
        <i class="fas fa-search"></i>
        <span>Search</span>
      </button>
      
      <!-- Loading indicator -->
      <div v-if="isSearching" 
           class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0"
         class="absolute w-full mt-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
      
      <!-- Search Results -->
      <div v-if="query">
        <div v-for="result in searchResults" 
             :key="result.lat + result.lon"
             @click="selectCity(result)"
             class="px-4 py-2 hover:bg-white/10 cursor-pointer transition-colors"
             :class="[currentTheme.mainTextClass]">
          <div class="flex items-center gap-2">
            <i class="fas fa-map-marker-alt text-sm opacity-60"></i>
            <span>{{ result.displayName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  currentTheme: {
    type: Object,
    required: true
  },
  API_KEY: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select-city'])

const query = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchTimeout = ref(null)

const handleSearchInput = async () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  
  if (!query.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  
  searchTimeout.value = setTimeout(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query.value}&limit=5&appid=${props.API_KEY}`
      )
      
      searchResults.value = response.data.map(city => ({
        ...city,
        displayName: formatCityName(city)
      }))
      
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      isSearching.value = false
    }
  }, 300)
}

const formatCityName = (city) => {
  let name = city.name
  if (city.state) name += `, ${city.state}`
  if (city.country) name += `, ${city.country}`
  return name
}

const selectCity = (city) => {
  query.value = formatCityName(city)
  searchResults.value = []
  emit('select-city', city)
}

const triggerSearch = () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  handleSearchInput()
}

const clearSearch = () => {
  query.value = ''
  searchResults.value = []
}
</script>

<style scoped>
input::placeholder {
  color: v-bind('currentTheme.placeholderColor');
}
</style>
