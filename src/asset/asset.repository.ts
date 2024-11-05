import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { AssetEntity } from "./entities/asset.entity";


@CustomRepository(AssetEntity)
export class AssetRepository extends Repository<AssetEntity>{
}