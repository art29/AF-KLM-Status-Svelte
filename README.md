# AF-KLM Flight Status App

This app is made to get as much information about a flight as possible. This includes latest information on delays, aircraft type and registration and more!

## Technical Side of things

The app uses the following main components :

- [SvelteKit](https://kit.svelte.dev/) - The web framework used
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [AirFrance-KLM API](https://developer.airfranceklm.com/products/) - The API used to get the flight information

### Installation

1. Clone the repo
2. Install the dependencies
   ```sh
   yarn
   ```
3. Create a `.env` file in the root of the project and add the following variables:
   ```txt
   PUBLIC_AIRFRANCE_KLM_API_KEY=YOUR_API_KEY
   ```
4. Run the project
   ```sh
   yarn dev
   ```

### License

This App has a AGPL-3.0 License. See `LICENSE` for more information.

### Contributing

Contributions are always welcome! Feel free to open a PR or Issue.
