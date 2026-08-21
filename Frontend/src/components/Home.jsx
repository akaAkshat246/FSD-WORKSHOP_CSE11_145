import bg from '../assets/bg.png'

const Home = () => {
  return (
    <div>
      <img
        src={bg}
        alt="Background"
        style={{
          width: '100%',
          maxWidth: 520,
          height: 'auto',
          borderRadius: 12,
          marginTop: 18,
          display: 'block'
        }}
      />
    </div>
  )
}

export default Home
