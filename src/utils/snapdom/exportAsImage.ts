import { snapdom } from "@zumer/snapdom";

const cssUrlPattern = /url\(["']?(.+?)["']?\)/g;

const preloadImage = (url: string) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = url;
  });

const waitForAssets = async (element: HTMLElement) => {
  const elements = [element, ...element.querySelectorAll<HTMLElement>("*")];
  const backgroundUrls = elements
    .flatMap((el) => [
      ...getComputedStyle(el).backgroundImage.matchAll(cssUrlPattern),
    ])
    .map((match) => match[1])
    .filter((url) => !url.startsWith("data:"));

  await Promise.all([
    document.fonts.ready,
    ...Array.from(element.querySelectorAll("img")).map((img) =>
      img.decode().catch(() => undefined)
    ),
    ...backgroundUrls.map(preloadImage),
  ]);
};

export const exportAsImage = async (element: HTMLElement) => {
  await waitForAssets(element);
  const image = await snapdom.toPng(element, {
    embedFonts: true,
    scale: 1,
    dpr: 1,
  });
  return image.src;
};

export const downloadImage = (imageBlob: string, fileName: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style.display = "none";
  fakeLink.download = fileName;
  fakeLink.href = imageBlob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};
