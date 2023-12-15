
const styles = {
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "28px",
  color: "#000000",
  textDecorationLine: "underline"
}

const convertLinks = (text: string) => {
  const regex = /{{(.*?)\|(.*?)}}/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (index % 3 === 1) {
      return <a style={styles} target="_blank" href={part} key={index}>{parts[index + 1]}</a>;
    } else if (index % 3 === 0) {
      return part;
    }
    return null;
  });
};

export default convertLinks;
