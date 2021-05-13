const API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNTNhN2VhMzQ3MmEzYzVjYjBjNGYyODAzM2Y2NmIzMCIsInN1YiI6IjVlNjBiMjg3NTVjOTI2MDAxMzU5N2UzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LL8B-zoRLyr389g3CnwHwMCqK0g6-mJ_R1uS7D_IIqM';
const ROOT_URL = 'https://api.themoviedb.org/3';

export default class MoviesService {
  static async search(searchTerm, pageNumber = 1, searchType) {
    const result = await fetch(
      `${ROOT_URL}/search/${searchType}?query=${searchTerm}&page=${pageNumber}&language=en-US&include_adult=false`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    );

    if (result.status === 404) throw new Error('Page not found');
    const resultJson = await result.json();
    return resultJson.results;
  }

  static async genre(searchTerm, pageNumber = 1) {
    const result = await fetch(
      `${ROOT_URL}/discover/movie?with_genres=${searchTerm}&page=${pageNumber}&include_adult=false`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    );

    if (result.status === 404) throw new Error('Page not found');
    const resultJson = await result.json();
    return resultJson.results;
  }

  static async getGenres() {
    const result = await fetch(`${ROOT_URL}/genre/movie/list?language=en-US`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    if (result.status === 404) throw new Error('Page not found');
    const resultJson = await result.json();
    return resultJson.genres;
  }

  static async movie(movie_id) {
    const result = await fetch(
      `${ROOT_URL}/movie/${movie_id}?language=en-US&append_to_response=credits`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    );

    if (result.status === 404) throw new Error('Page not found');
    const resultJson = await result.json();
    return resultJson;
  }

  static async person(person_id) {
    const result = await fetch(
      `${ROOT_URL}/person/${person_id}?language=en-US&append_to_response=movie_credits`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    );

    if (result.status === 404) throw new Error('Page not found');
    const resultJson = await result.json();
    return resultJson;
  }
}
