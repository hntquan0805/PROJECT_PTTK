"use client"

import { useState } from "react"
import CertificateLookup from "../../components/certificate-lookup"
import CertificateDetails from "../../components/certificate-details"
import type { CertificateDetailsData } from "@/lib/models/certificate.model"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle } from "lucide-react"

export default function Page() {
  const [showDetails, setShowDetails] = useState(false)
  const [certificateData, setCertificateData] = useState<CertificateDetailsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearchSuccess = (data: CertificateDetailsData) => {
    setCertificateData(data)
    setShowDetails(true)
    setError(null) // Clear any previous errors
  }

  const handleSearchError = (message: string) => {
    setError(message)
    setCertificateData(null)
    setShowDetails(false)
  }

  const handleBackToLookup = () => {
    setShowDetails(false)
    setCertificateData(null)
    setError(null) // Clear errors when going back
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <XCircle className="h-5 w-5 text-red-600" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {showDetails && certificateData ? (
        <CertificateDetails data={certificateData} onBack={handleBackToLookup} />
      ) : (
        <CertificateLookup
          onSearchSuccess={handleSearchSuccess}
          onSearchError={handleSearchError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  )
}
