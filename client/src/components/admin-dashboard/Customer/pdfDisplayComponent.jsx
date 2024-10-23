import React, { useEffect, useState } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import axios from 'axios';
import pdfTemplate from "../../../assets/Template.pdf";

const PDFDisplayComponent = ({ customerId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generatePdf = async (customerData, babyNames) => {
    try {
      // Fetch the PDF template
      const pdfTemplateBytes = await fetch(pdfTemplate).then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 25;
      const lineSpacing = 40;
      const lineSpacing1 = 52;

      // Get the pages
      const firstPage = pdfDoc.getPage(0);
      let secondPage = pdfDoc.getPage(1);
      let thirdPage = pdfDoc.getPageCount() > 2 ? pdfDoc.getPage(2) : null;

      // Calculate astrological details based on birth date and time
      const birthDate = new Date(customerData.babyBirthDate);
      const staticData = {
        gender: customerData.babyGender,
        zodiacSign: getZodiacSign(birthDate), // You'll need to implement this
        nakshatra: getNakshatra(birthDate), // You'll need to implement this
        gemstone: getGemstone(birthDate), // You'll need to implement this
        destinyNumber: calculateDestinyNumber(birthDate), // You'll need to implement this
        luckyColour: getLuckyColor(birthDate), // You'll need to implement this
        birthDate: birthDate.toLocaleDateString(),
        birthTime: customerData.babyBirthTime,
        numerology: calculateNumerology(birthDate), // You'll need to implement this
        luckyDay: getLuckyDay(birthDate), // You'll need to implement this
        luckyGod: customerData.preferredGod || 'Not specified',
        luckyMetal: getLuckyMetal(birthDate), // You'll need to implement this
      };

      // Embed static data on first page
      let textYPosition = 620;
      firstPage.drawText(staticData.gender, { x: 320, y: textYPosition, size: fontSize, font });
      textYPosition -= lineSpacing;
      // ... (rest of the static data embedding)

      // Embed baby names on second/third page
      let yPosition = 600;
      babyNames.forEach(({ name, meaning }, index) => {
        if (yPosition < 100 && !thirdPage) {
          thirdPage = pdfDoc.addPage();
          yPosition = 600;
        } else if (yPosition < 100 && thirdPage) {
          secondPage = thirdPage;
          yPosition = 600;
        }

        secondPage.drawText(`Name: ${name}`, { x: 50, y: yPosition, size: fontSize, font });
        yPosition -= 60;
        secondPage.drawText(`Meaning: ${meaning}`, { x: 50, y: yPosition, size: fontSize, font });
        yPosition -= 80;
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Save PDF to database
      await savePdfToDatabase(customerId, url, babyNames);

      return url;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const savePdfToDatabase = async (customerId, pdfUrl, babyNames) => {
    try {
      const response = await axios.post('http://localhost:3000/api/savePdf', {
        customerId,
        pdfUrl,
        babyNames: babyNames.map(name => name._id)
      });
      return response.data;
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchDataAndGeneratePdf = async () => {
      try {
        setLoading(true);
        // Fetch customer details
        const customerResponse = await axios.get(`http://localhost:3000/api/customers/${customerId}`);
        const customerData = customerResponse.data;

        // Fetch associated baby names
        const namesResponse = await axios.get(`http://localhost:3000/api/babyNames/${customerId}`);
        const babyNames = namesResponse.data;

        // Generate PDF
        const generatedPdfUrl = await generatePdf(customerData, babyNames);
        setPdfUrl(generatedPdfUrl);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchDataAndGeneratePdf();
    }
  }, [customerId]);

  if (loading) {
    return <div>Loading PDF...</div>;
  }

  if (error) {
    return <div>Error generating PDF: {error}</div>;
  }

  return (
    <div className="w-full h-screen">
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          title="Generated PDF"
        />
      )}
    </div>
  );
};

export default PDFDisplayComponent;