/**
 * The example component of the README section on component tests.
 *
 * @feature none (infrastructure)
 */

/**
 * Page heading with a text the caller takes from copy/pl.json.
 *
 * @param props.text - The heading text.
 * @returns The heading.
 * @feature none (infrastructure)
 */
export function BrandHeading({ text }: { text: string }): React.JSX.Element {
  return <h1>{text}</h1>
}
