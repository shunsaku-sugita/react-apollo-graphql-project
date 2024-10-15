export const Title = () => {
  const styles = getStyles();
  return (
    <h1 style={styles.header}>PEOPLE AND THEIR CARS</h1>
  )
}

const getStyles = () => ({
  header: {
    padding: '16px',
    marginBottom: '30px'
  }
});
