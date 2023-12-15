//styles
import styles from "./index.module.scss";

const tags = [
  "<bold>text</bold> - to make text bold",
  "<point>text</point>",
];

const BlogLegend = () => {
  return (
    <div className={styles.container}>
      <h6 className={styles.title}>Conditional marks</h6>
      <div className={styles.list}>
        {tags.map((tag, i) => (
          <p className={styles.row} key={i}>
            {tag}
          </p>
        ))}
      </div>
    </div>
  );
};

export default BlogLegend;
