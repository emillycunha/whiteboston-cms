# Contributing to WhiteBoston-CMS

Thank you for considering contributing to WhiteBoston-CMS! We welcome all contributions to improve this project.

## Getting Started

1. **Fork the repository:**

   - Visit the repository and click the "Fork" button.

2. **Clone your fork:**

   ```bash
   git clone https://github.com/your-username/WhiteBoston-CMS.git
   ```

3. **Install dependencies:**

   ```bash
   cd WhiteBoston-CMS
   npm install
   ```

4. **Run the application locally:**

   ```bash
   npm run dev
   ```

5. **Create a branch:**
   ```bash
   git checkout -b your-feature-name
   ```

## Code of Conduct

We follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please read and adhere to it in all interactions.

## How to Contribute

### Reporting Issues

If you encounter a bug or have a question, please [create an issue](https://github.com/WhiteBoston-CMS/WhiteBoston-CMS/issues) with the following:

- Clear title and description.
- Steps to reproduce (if applicable).
- Expected and actual behavior.

### Suggesting Features

We’re always open to new ideas! If you have a feature in mind, open a [feature request issue](https://github.com/WhiteBoston-CMS/WhiteBoston-CMS/issues) with:

- A detailed description.
- Use cases or examples of the feature.

### Submitting Pull Requests

1. Ensure your code follows the [Development Guidelines](#development-guidelines).
2. Commit changes:
   ```bash
   git commit -m "Add description of your changes"
   ```
3. Push changes to your fork:
   ```bash
   git push origin your-feature-name
   ```
4. Open a pull request:
   - Go to the original repository and click "New Pull Request."
   - Ensure your branch is up to date with `main` and describe your changes.

## Development Guidelines

- Follow the coding style outlined in the project’s eslint and prettier configurations.
- Use descriptive commit messages.
- Test your changes locally before submitting.
- Keep PRs focused on one feature or fix.

### Commit Convention

We use the [Conventional Commits](https://www.conventionalcommits.org/) standard. This helps automate versioning and changelog generation. Use the following structure for commit messages:

```plaintext
<type>(<scope>): <description>

<body>

<footer>
```

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

#### Examples

- `feat(auth): add login functionality`
- `fix(ui): correct button alignment issue`
- `docs(readme): update contributing section`

## License

This project is licensed under the [MIT License](LICENSE). By contributing, you agree that your contributions will be licensed under its terms.

---

Thank you for contributing! Together, we’re building something great.
