import React, { useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'

interface OrderTypeUploadProps {
  onUpload: (file: File) => Promise<any>
  onCancel: () => void
  isLoading?: boolean
}

const OrderTypeUpload: React.FC<OrderTypeUploadProps> = ({ onUpload, onCancel, isLoading = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setError('')
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.yml') && !file.name.toLowerCase().endsWith('.yaml')) {
      setError('Please select a YAML file (.yml or .yaml)')
      return
    }
    
    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setError('File size must be less than 1MB')
      return
    }
    
    setSelectedFile(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    try {
      await onUpload(selectedFile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">YAML File</label>
        <div
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
            dragActive 
              ? 'border-primary-400 bg-primary-50' 
              : selectedFile 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            {selectedFile ? (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <div className="flex text-sm text-gray-600">
                  <span className="font-medium text-green-600">{selectedFile.name}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".yml,.yaml"
                      onChange={handleFileInputChange}
                      disabled={isLoading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">YAML files only, up to 1MB</p>
              </>
            )}
          </div>
        </div>
        
        {selectedFile && (
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Remove file
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-start space-x-2">
          <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">YAML Format Requirements:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Must contain an <code>order_type</code> section</li>
              <li>Required fields: <code>code</code>, <code>name</code>, <code>fields</code></li>
              <li>Optional: <code>print_form_code</code></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? 'Uploading...' : 'Upload Order Type'}
        </button>
      </div>
    </form>
  )
}

export default OrderTypeUpload