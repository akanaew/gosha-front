import React, {useEffect, useRef, useState} from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Slider from "react-slick";


const App = () => {
    const [firstCarousel, setFirstCarousel] = useState([]);
    const [secondCarousel, setSecondCarousel] = useState([]);
    const [threeCarousel, setTreeCarousel] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(0);
    const [play, setPlay] = useState(false);

    let videosRef = null;
    const carouselRef = useRef();
    if (threeCarousel.length !== 0 ) {
        videosRef = Array(threeCarousel.length).fill(0).map(i=> React.createRef())
    }
    const settings = {
        dots: false,
        infinite: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        pauseOnHover: false,
        arrows: false
    };

    const settings2 = {
        dots: false,
        infinite: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        pauseOnHover: false,
        arrows: false
    };

    const settings3 = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        pauseOnHover: false,
        arrows: false,
        swipe: false
    };
    
    const request = () => {
        fetch('http://localhost:5000/carousel?index=1')
            .then(res => res.json())
            .then(res => setFirstCarousel(res));
        fetch('http://localhost:5000/carousel?index=2')
            .then(res => res.json())
            .then(res => setSecondCarousel(res));
        fetch('http://localhost:5000/carousel?index=3')
            .then(res => res.json())
            .then(res => {
                setTreeCarousel(res);
            });
    }
    
    useEffect(() => {
        request()
    }, []);

    const afterChangeHandler = (currentSlide) => {
        console.log('afterChangeHandler', currentSlide);
        if (threeCarousel.lenght === currentSlide) {
            request();
        }
        videosRef[currentSlide].current.play().then(e => console.log(e)).catch(e => console.log('Error:' ,e))
        setCurrentVideo(currentSlide)
        videosRef[currentSlide].current.muted = false;
    }

    const beforeChangeHandler = (currentSlide) => {
        console.log('beforeChangeHandler', currentSlide);
        videosRef[currentSlide].current.pause()
        videosRef[currentSlide].current.muted = true;
    }

    return (
        <div className="page">
            <div className="page__col">
                <Slider {...settings}>
                    {firstCarousel.map((item, index) => {
                        return <img key={`carousel-1-${index}`} src={item} alt={item} />
                    })}
                </Slider>
            </div>
            <div className="page__col">
                <Slider {...settings2}>
                    {secondCarousel.map((item, index) => {
                        return <img key={`carousel-2-${index}`} src={item} alt={item} />
                    })}
                </Slider>
            </div>
            <div className="page__col">
                <Slider ref={carouselRef} {...settings3} afterChange={afterChangeHandler} beforeChange={beforeChangeHandler}>
                    {threeCarousel.map((item, index) => {
                        return (
                            <video ref={videosRef[index]} key={`carousel-3-${index}`} autoPlay={true} muted={true} playsInline={true} onEnded={() => carouselRef.current.slickNext()}>
                                <source src={item} type="video/mp4"></source>
                            </video>
                        )
                    })}
                </Slider>
            </div>
            {play ? null : <button className={"Play"} onClick={() => {
                videosRef[currentVideo].current.play(); setPlay(true)}}>Play</button>}
        </div>

    );
}

export default App;
