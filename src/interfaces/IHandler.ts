export default interface IHandler {
  LoadEvents(): void;
  LoadCommands(): void;
  LoadButtons(): void;
  LoadLavalinkEvents(): void;
}
