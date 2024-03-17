import * as gql from "../gql";
import { Account, Allow, BaseResolver, Id, RequiredAuth, RequiredSignature } from "@shared/util-server";
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { KeyringService } from "./keyring.service";
import { UseGuards } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { srv as external } from "@external/module";

@Resolver(() => gql.Keyring)
export class KeyringResolver extends BaseResolver(gql.Keyring, gql.KeyringInput, Allow.Admin, Allow.Admin, Allow.User) {
  constructor(
    private readonly keyringService: KeyringService,
    private readonly userService: UserService,
    private readonly cloudflareService: external.CloudflareService
  ) {
    super(keyringService);
  }
  @Query(() => gql.Keyring)
  async myKeyring(@RequiredAuth() account: Account) {
    return await this.keyringService.pick({
      _id: account.keyring,
      status: "active",
    });
  }
  @Query(() => gql.User)
  @UseGuards(Allow.User)
  async whoAmI(@RequiredAuth() account: Account) {
    return await this.keyringService.whoAmI(new Id(account.keyring));
  }

  //*=================================================================*//
  //*====================== Wallet Signing Area ======================*//
  //*====================== Wallet Signing Area ======================*//
  //*=================================================================*//

  //*===================================================================*//
  //*====================== Password Signing Area ======================*//
  @Query(() => ID, { nullable: true })
  async getKeyringIdHasAccountId(@Args({ name: "accountId", type: () => String }) accountId: string) {
    return await this.keyringService.getKeyringIdHasAccountId(accountId);
  }
  @Mutation(() => gql.Keyring)
  async signupPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true })
    keyringId: string | null
  ) {
    //! 임시 비활
    // if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringService.signupPassword(accountId, password, keyringId ? new Id(keyringId) : null);
  }

  @Mutation(() => gql.Keyring)
  async signupPasswordPhone(
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true })
    keyringId: string | null
  ) {
    //! 임시 비활
    // if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringService.signupPassword2(phone, password, keyringId ? new Id(keyringId) : null);
  }

  @Mutation(() => gql.AccessToken)
  async signinPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string
  ) {
    //! 임시 비활
    //if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringService.signinPassword(accountId, password);
  }

  @Mutation(() => gql.AccessToken)
  async signinPasswordPhone(
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string
  ) {
    //! 임시 비활
    //if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringService.signinPassword2(phone, password);
  }

  @Mutation(() => gql.Keyring)
  @UseGuards(Allow.Every)
  async signaddPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string,
    @RequiredAuth() account: Account
  ) {
    if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringService.signaddPassword(accountId, password, account.keyring);
  }
  @Mutation(() => Boolean)
  @UseGuards(Allow.Every)
  async changePassword(
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "prevPassword", type: () => String }) prevPassword: string,
    @Args({ name: "token", type: () => String }) token: string,
    @RequiredAuth() account: Account
  ) {
    if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    await this.keyringService.changePassword(password, prevPassword, account.keyring);
    return true;
  }
  @Mutation(() => Boolean)
  @UseGuards(Allow.Every)
  async changePasswordWithPhone(
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string,
    @RequiredAuth() account: Account
  ) {
    await this.keyringService.changePasswordWithPhone(password, phone, phoneCode, account.keyring);
    return true;
  }
  @Mutation(() => Boolean)
  async resetPassword(@Args({ name: "accountId", type: () => String }) accountId: string) {
    return await this.keyringService.resetPassword(accountId);
  }
  //*====================== Password Signing Area ======================*//
  //*===================================================================*//

  //*================================================================*//
  //*====================== Phone Signing Area ======================*//
  @Query(() => ID, { nullable: true })
  async getKeyringIdHasPhone(@Args({ name: "phone", type: () => String }) phone: string) {
    return await this.keyringService.getKeyringIdHasPhone(phone);
  }
  @Mutation(() => gql.Keyring)
  async addPhoneInPrepareKeyring(
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true })
    keyringId: string | null
  ) {
    return await this.keyringService.addPhoneInPrepareKeyring(phone, keyringId ? new Id(keyringId) : null);
  }
  @Mutation(() => gql.Keyring)
  @UseGuards(Allow.User)
  async addPhoneInActiveKeyring(
    @Args({ name: "phone", type: () => String }) phone: string,
    @RequiredAuth() account: Account
  ) {
    return await this.keyringService.addPhoneInActiveKeyring(phone, account.keyring);
  }
  @Mutation(() => Date)
  async requestPhoneCode(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "hash", type: () => String }) hash: string
  ) {
    return await this.keyringService.requestPhoneCode(new Id(keyringId), phone, hash);
  }
  @Mutation(() => gql.Keyring)
  async verifyPhoneCode(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    return await this.keyringService.verifyPhoneCode(new Id(keyringId), phone, phoneCode);
  }
  @Mutation(() => gql.Keyring)
  async signupPhone(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    return await this.keyringService.signupPhone(new Id(keyringId), phone, phoneCode);
  }
  @Mutation(() => gql.AccessToken)
  async signinPhone(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    return await this.keyringService.signinPhone(new Id(keyringId), phone, phoneCode);
  }
  @Mutation(() => gql.Keyring)
  @UseGuards(Allow.User)
  async signaddPhone(
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string,
    @RequiredAuth() account: Account
  ) {
    return await this.keyringService.signaddPhone(account.keyring, phone, phoneCode);
  }
  //*====================== Phone Signing Area ======================*//
  //*================================================================*//
  @Mutation(() => gql.Keyring)
  async activateUser(@Args({ name: "keyringId", type: () => ID }) keyringId: string) {
    return await this.keyringService.activateUser(new Id(keyringId));
  }
}
