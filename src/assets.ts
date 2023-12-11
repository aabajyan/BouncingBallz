export class AssetLoader {
  private assets: Map<string, HTMLImageElement> = new Map()
  private assetsToLoad = 0

  add(name: string, url: string): void {
    this.assetsToLoad++
    const asset = new Image()
    asset.src = url
    asset.onload = () => this.assetsToLoad--

    this.assets.set(name, asset)
  }

  get(name: string): HTMLImageElement | null {
    return this.assets.get(name) || null
  }

  get isReady(): boolean {
    return this.assetsToLoad === 0
  }
}
