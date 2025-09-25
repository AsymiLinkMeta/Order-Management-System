import React, { useState } from 'react'
import { Printer, FileText, Download } from 'lucide-react'

interface PrintActionsProps {
  orderCode?: string
  orderCodes?: string[]
  printFormCode?: string
  onPrint: (options: { convertToPdf: boolean; orderCodes: string[] }) => Promise<void>
}

const PrintActions: React.FC<PrintActionsProps> = ({
  orderCode,
  orderCodes = [],
  printFormCode,
  onPrint
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const codes = orderCode ? [orderCode] : orderCodes

  const handlePrint = async (convertToPdf: boolean) => {
    if (!printFormCode) {
      setError('No print template configured for this order type')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await onPrint({ convertToPdf, orderCodes: codes })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Print failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!printFormCode) {
    return (
      <div className="text-sm text-gray-500">
        No print template configured
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={() => handlePrint(false)}
          disabled={isLoading}
          className="btn btn-secondary text-sm"
          title="Print as HTML"
        >
          <Printer className="h-4 w-4 mr-1" />
          Print
        </button>
        <button
          onClick={() => handlePrint(true)}
          disabled={isLoading}
          className="btn btn-secondary text-sm"
          title="Print as PDF"
        >
          <Download className="h-4 w-4 mr-1" />
          Print PDF
        </button>
      </div>
    </div>
  )
}

export default PrintActions