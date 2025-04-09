import html2canvas from "html2canvas";

export const exportAsImage = async (element: HTMLElement) => {
  const canvas = await html2canvas(element);
  return canvas.toDataURL("image/png", 1.0);
};

export const downloadImage = (imageBlob: string, fileName: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;
  fakeLink.href = imageBlob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};
