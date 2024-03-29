import { BaseGql, Id, ObjectId } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { cnst } from "@shared/util";
import { gql as shared } from "@shared/module";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  root?: Id;

  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  type: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, refPath: "type", required: false, index: true })
  target?: Id;

  @Field(() => shared.User, { nullable: true })
  @Prop({ type: ObjectId, ref: "user", required: false, index: true })
  targetUser?: Id;

  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true, index: true })
  from: Id;

  @Field(() => String)
  @Prop({ type: String, maxlength: 200, required: true, index: true })
  title: string;

  @Field(() => String)
  @Prop({ type: String, maxlength: 10000, required: true, index: true })
  content: string;

  @Field(() => [shared.File])
  @Prop([{ type: ObjectId, required: true }])
  files: Id[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  targetUser?: Id;

  @Field(() => ID)
  from: Id;

  @Field(() => [ID])
  files: Id[];
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => shared.Admin, { nullable: true })
  @Prop({ type: ObjectId, ref: "admin", index: true })
  replyFrom?: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, maxlength: 10000 })
  replyContent?: string;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: new Date() })
  replyAt: Date;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.reportStatuses,
    required: true,
    default: "active",
  })
  status: cnst.ReportStatus;
}

// * 최종 생성 모델
@InputType()
export class ReportInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Report extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class ReportSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class ReportSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalReport: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  activeReport: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  inProgressReport: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  resolvedReport: number;
}
