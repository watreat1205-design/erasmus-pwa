import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

function getArg(name: string) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function main() {
  const input = getArg("input");
  const output = getArg("output");
  const moduleTitle = getArg("module") ?? "Module 1";
  const activityTitle = getArg("activity") ?? "Activity 1.1";
  const version = getArg("version") ?? "v1.0";

  if (!input || !output) {
    console.error(
      'Usage: npx tsx scripts/stamp-activity-pdf.ts --input <in.pdf> --output <out.pdf> --module "..." --activity "..." --version v1.0'
    );
    process.exit(1);
  }

  const inputBytes = await fs.readFile(input);
  const pdf = await PDFDocument.load(inputBytes);
  pdf.registerFontkit(fontkit);

  // Fonts (repo)
  const regularFontBytes = await fs.readFile(
    path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf")
  );
  const boldFontBytes = await fs.readFile(
    path.join(process.cwd(), "public", "fonts", "NotoSans-Bold.ttf")
  );
  const fontRegular = await pdf.embedFont(regularFontBytes);
  const fontBold = await pdf.embedFont(boldFontBytes);

  // Logos (NO CCIF)
  const erasmusPath = path.join(process.cwd(), "public", "quiz-brand", "erasmus.png");
  const dropsPath = path.join(process.cwd(), "public", "quiz-brand", "drops.jpg");

  const [erasmusBytes, dropsBytes] = await Promise.all([
    fs.readFile(erasmusPath),
    fs.readFile(dropsPath),
  ]);

  const erasmusImg = await pdf.embedPng(erasmusBytes);
  const dropsImg = await pdf.embedJpg(dropsBytes);

  const pages = pdf.getPages();

  // Footer settings (NO footer line)
  const marginX = 36;
  const textColor = rgb(0.15, 0.15, 0.15);

  const disclaimer =
    "Co-funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the granting authority.";

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const isFirst = i === 0;

    // PAGE 1 ONLY: place logos in the two placeholders on the blue cover
    if (isFirst) {
      const boxW = width * 0.18;
      const boxH = height * 0.075;

      // tuned for your cover layout
      const boxY = height * 0.865;
      const leftBoxX = width * 0.12;
      const rightBoxX = width * 0.70;

      // DROPS in left placeholder
      const dropsW = boxW * 0.92;
      const dropsH = (dropsImg.height / dropsImg.width) * dropsW;
      page.drawImage(dropsImg, {
        x: leftBoxX + (boxW - dropsW) / 2,
        y: boxY + (boxH - dropsH) / 2,
        width: dropsW,
        height: dropsH,
      });

      // ERASMUS in right placeholder
      const erW = boxW * 0.92;
      const erH = (erasmusImg.height / erasmusImg.width) * erW;
      page.drawImage(erasmusImg, {
        x: rightBoxX + (boxW - erW) / 2,
        y: boxY + (boxH - erH) / 2,
        width: erW,
        height: erH,
      });
    }

  }

  const outBytes = await pdf.save();
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, outBytes);

  console.log(`✅ Branded PDF saved: ${output}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
