import { Locator, Page, expect } from '@playwright/test';

export class CanvasComponent {

  constructor(private page: Page) {}

  async dropElement(elementText: string, quadrant = 1) {
    const canvas = this.page.locator('//*[@data-testid="rf__wrapper"]');
    await expect(canvas).toBeVisible({ timeout: 20000 });

    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const rows = 2;
    const cols = 10;
    const positions = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          x: box.x + box.width * ((col + 0.5) / cols),
          y: box.y + box.height * ((row + 0.5) / rows),
        });
      }
    }

    const target = positions[quadrant - 1];
    if (!target) throw new Error(`Quadrant ${quadrant} out of bounds`);

    const source = this.page.getByText(elementText, { exact: true });
    await expect(source).toBeVisible({ timeout: 15000 });

    const sourceBox = await source.boundingBox();
    if (!sourceBox) throw new Error(`Element "${elementText}" not found`);

    await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(target.x, target.y, { steps: 25 });
    await this.page.mouse.up();

    console.log(`Box "${elementText}" dropped in quadrant ${quadrant}`);
  }
  async linkSourceElement(type: string, fromBox: string, toBox: string, targetHandle = 'input-0') {
    let fromHandle: Locator;
    let fromHandle2: Locator | null = null;
    let toHandle: Locator;

    switch (type) {
      case 'source':
  
        fromHandle = this.page.locator(
          `//*[contains(text(),"${fromBox}")]/ancestor::*[@data-id]//*[@data-handleid="out"]`
        );
        toHandle = this.page.locator(
          `//*[contains(text(),"${toBox}")]/ancestor::*[@data-testid="WorkflowGenericNodeBox"]//*[@data-testid="${targetHandle}"]`
        );
        break;

      case 'component':
  
        if (fromBox.includes('Spatial Filter')) {
    
          fromHandle = this.page.locator(
            `//*[contains(text(),"${fromBox}")]/ancestor::*[@data-id]//*[@data-testid="output-0"]`
          );
          fromHandle2 = this.page.locator(
            `//*[contains(text(),"${fromBox}")]/ancestor::*[@data-id]//*[@data-testid="output-1"]`
          );
        } else {
    
          fromHandle = this.page.locator(`//*[contains(text(),"${fromBox}")]/ancestor::*[@data-id]//*[@data-handleid="out" or @data-testid="output-0"]`);
        }

        toHandle = this.page.locator(`//*[contains(text(),"${toBox}")]/ancestor::*[@data-id]//*[@data-testid="${targetHandle}"]`);
        break;

      default:
        throw new Error(`Unknown link type: ${type}`);
    }

    await this.connectHandles(fromHandle, toHandle, fromBox, toBox);

    if (fromHandle2) {
      await this.connectHandles(fromHandle2, toHandle, fromBox, toBox);
    }
  }
  private async connectHandles(fromHandle: Locator, toHandle: Locator, fromBox: string, toBox: string) {
    const outBox = await fromHandle.boundingBox();
    const inBox = await toHandle.boundingBox();

    if (!outBox || !inBox)
      throw new Error(`Handles not found for ${fromBox} → ${toBox}`);

    await this.page.mouse.move(outBox.x + outBox.width / 2, outBox.y + outBox.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(inBox.x + inBox.width / 2, inBox.y + inBox.height / 2, { steps: 25 });
    await this.page.waitForTimeout(200);
    await this.page.mouse.up();

    console.log(`Linked ${fromBox} → ${toBox}`);
  }
}
