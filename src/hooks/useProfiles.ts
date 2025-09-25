import { useState } from 'react'
import { profilesAPI } from '../services/api'
import { Profile } from '../types'

export function useProfiles() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProfile = async (profileData: Partial<Profile>) => {
    try {
      setIsLoading(true)
      setError(null)
      const profile = await profilesAPI.create(profileData)
      return profile
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (id: number, profileData: Partial<Profile>) => {
    try {
      setIsLoading(true)
      setError(null)
      const profile = await profilesAPI.update(id, profileData)
      return profile
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    createProfile,
    updateProfile
  }
}