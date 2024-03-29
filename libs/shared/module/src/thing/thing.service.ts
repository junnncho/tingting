import * as Thing from "./thing.model";
import * as gql from "../gql";
import { DataLoader, Id, LoadService, createLoader } from "@shared/util-server";
import { FileService } from "../file/file.service";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ThingService extends LoadService<Thing.Mdl, Thing.Doc, Thing.Input> {
  rootLoader: DataLoader<Id, Thing.Doc | null>;
  constructor(
    @InjectModel(Thing.name)
    private readonly Thing: Thing.Mdl,
    private readonly fileService: FileService
  ) {
    super(ThingService.name, Thing);
    this.rootLoader = createLoader(Thing, "root");
  }

  async rootLoad(rootId?: Id): Promise<Thing.Doc | null> {
    return (rootId && (await this.rootLoader.load(rootId))) as Thing.Doc | null;
  }
  async generate(name: string, data: Partial<Thing.Doc> = {}): Promise<Thing.Doc> {
    return (
      (await this.Thing.findOne({ name })) ??
      (
        await new this.Thing({
          ...data,
          name,
          description: name,
          image: (await this.fileService.generate())._id,
        })
      ).save()
    );
  }
  async summarize(): Promise<gql.ThingSummary> {
    return {
      totalThing: await this.Thing.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
