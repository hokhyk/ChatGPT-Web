interface HttpBody {
  code: number;
  data: any[];
  message: string;
}

function httpBody(code: number, ...rest: any[]): HttpBody {
  const body: HttpBody = {
    code,
    data: [],
    message: '',
  };

  if (rest.length === 1 && typeof rest[0] === 'string') {
    body.message = rest[0];
  } else if (rest.length === 2 && typeof rest[0] !== 'string' && typeof rest[1] === 'string') {
    body.data = rest[0];
    body.message = rest[1];
  } else if (rest.length === 1 && typeof rest[0] !== 'string') {
    body.data = rest[0];
  }

  return body;
}

export default httpBody;
