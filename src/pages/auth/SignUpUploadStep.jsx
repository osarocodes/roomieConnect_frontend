import { Camera, X } from 'lucide-react'

export default function Uploader({ 
  imagePreviewUrl,
  filePreview,
  admissionLetter,
  pdfObjectUrlRef,
  handleProfileChange,
  handleFileChange,
  handleRemoveProfile,
  handleRemoveLetter,
  loading,
  registerRef
}) {

  return (
      <div className="space-y-3">
        {/* <h1 className="text-xl font-bold">Upload Files</h1> */}
          <h3 className="text-lg font-semibold">Profile Picture</h3>
          <p className="text-sm text-gray-600 mb-2">Please provide an actual image of yourself, this will appear on your account</p>
          <div className="flex flex-col items-center gap-4" ref={(el) => registerRef('profilePic', el)}>
              <div className="relative">
                <img src={imagePreviewUrl || "/default-profile.svg"} alt="Profile Preview" className="size-25 object-cover rounded-full border-4" />
                <br />
              <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 hover-scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${loading ? "animate-pulse pointer-events-none" : ""}`}>
                <Camera  className="size-10 bg-gray-800 rounded-full p-1" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  onChange={handleProfileChange}
                  aria-label="Upload profile picture"
                  accept="image/jpeg,image/png"
                  />
              </label>
              {imagePreviewUrl && (
                <button
                  type="button"
                  className="absolute top-1 right-1 hover-scale "
                  onClick={handleRemoveProfile}
                  aria-label="Remove profile picture"
                >
                  <X className="size-5 rounded-md bg-gray-800" color="red" />
                </button>
              )}
          </div>
        </div>

          <h3 className="text-lg font-semibold">Admission Letter</h3>
          <p className="text-sm text-gray-600 mb-2">
            This will be used to verify your student status.
          </p>
          <div className="flex flex-col items-center gap-4" ref={(el) => registerRef('admissionLetter', el)}>
            {!admissionLetter ? (
              <label htmlFor="file-upload" className={`relative w-full h-40 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-gray-400 transition-all duration-200 ${loading ? "animate-pulse pointer-events-none" : ""}`}>
                <img src="/default-file.svg" alt="Upload file" className="size-16" />
                <p className="text-gray-500 mt-2">Click to upload (PDF, JPG, PNG)</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  aria-label="Upload admission letter"
                  accept="image/jpeg,image/png,application/pdf"
                />
              </label>
            ) : (
              <div className="relative w-full p-4 border-2 rounded-lg">
                <div className="flex items-center gap-4">
                  {filePreview ? (
                    <img src={filePreview} alt="Admission Letter Preview" className="size-20 object-cover rounded-md border" />
                  ) : (
                    <img src="/default-file.svg" alt="File icon" className="size-20" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold break-all">{admissionLetter.name}</p>
                    {admissionLetter.type === 'application/pdf' && (
                      <a
                        href={pdfObjectUrlRef.current}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        aria-label="View PDF admission letter"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={handleRemoveLetter}
                  aria-label="Remove admission letter"
                >
                  <X className="size-7" />
                </button>
              </div>
            )}
          </div>

      </div>
  )
}