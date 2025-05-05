import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/Icons";
import { File } from "lucide-react";
import html2canvas from "html2canvas";

interface CertificateProps {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  certificateId: string;
}

export const Certificate: React.FC<CertificateProps> = ({
  studentName,
  courseName,
  instructorName,
  completionDate,
  certificateId,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadAsPNG = async () => {
    if (!certificateRef.current) return;

    // Add a class to make the certificate look better for download
    certificateRef.current.classList.add("certificate-download");

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${courseName.replace(/\s+/g, "-")}-Certificate.png`;
      link.click();
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      certificateRef.current.classList.remove("certificate-download");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={certificateRef}
        className="relative w-full max-w-3xl aspect-[1.4/1] overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white"
      >
        {/* Certificate Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 z-0">
          <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-500"></div>

          {/* Decorative Elements */}
          <div className="absolute top-16 left-16 w-32 h-32 rounded-full border-8 border-indigo-100 opacity-30"></div>
          <div className="absolute bottom-16 right-16 w-40 h-40 rounded-full border-8 border-blue-100 opacity-30"></div>
          <div className="absolute top-1/4 right-1/3 w-20 h-20 rounded-full border-4 border-indigo-200 opacity-20"></div>
        </div>

        {/* Certificate Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-between p-8 text-center">
          <div className="w-full pt-8">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-2">
              Certificate of Completion
            </h2>
            <p className="text-gray-600 mb-6">This is to certify that</p>
            <h1 className="text-3xl sm:text-5xl font-serif text-indigo-700 font-bold mb-4">
              {studentName}
            </h1>
            <p className="text-gray-600 mb-2">
              has successfully completed the course
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-6 px-8">
              {courseName}
            </h3>
          </div>

          <div className="w-full grid grid-cols-2 gap-8 mt-auto">
            <div className="text-left">
              <div className="border-t-2 border-gray-400 pt-2">
                <p className="text-xl font-semibold">{instructorName}</p>
                <p className="text-sm text-gray-600">Instructor</p>
              </div>
            </div>

            <div className="text-right">
              <div className="border-t-2 border-gray-400 pt-2">
                <p className="text-lg">{completionDate}</p>
                <p className="text-sm text-gray-600">Completion Date</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            Certificate ID: {certificateId}
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <Button onClick={downloadAsPNG}>
          <File className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </div>
    </div>
  );
};
