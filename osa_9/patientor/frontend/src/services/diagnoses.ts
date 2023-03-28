import axios from "axios";
import { Diagnosis } from "../types";

import { apiBaseUrl } from "../constants";


// Backend antaa taulukon, mutta se muutetaan tässä Map:iksi code -> name: 
const getAll = async () => {
  const { data } = await axios.get<Diagnosis[]>(
    `${apiBaseUrl}/diagnoses`
  );
  return new Map(data.map(e => [e.code, e.name]));
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll
};