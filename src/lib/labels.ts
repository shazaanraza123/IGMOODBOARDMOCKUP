export function attributeLabel(attribute: string): string {
  const phrase = attribute.split("-").join(" ");
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}
