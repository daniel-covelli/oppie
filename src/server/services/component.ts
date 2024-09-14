import { db } from "../db";

export default class ComponentService {
  public async getNextPosition({ fileId }: { fileId: string }) {
    const nextPosition = (
      await db.component.aggregate({
        where: { fileId: fileId },
        _max: { position: true },
      })
    )._max.position;
    return nextPosition === null ? 1 : nextPosition + 1;
  }
}
