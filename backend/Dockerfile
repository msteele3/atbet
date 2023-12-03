### This is the container for our aws backend

FROM public.ecr.aws/lambda/python:3.11

COPY "./requirements.txt" ${LAMBDA_TASK_ROOT}

ENV LOG_LEVEL "INFO"
ENV PYBASEBALL_CACHE "/tmp/pybaseball-cache"
ENV MPLCONFIGDIR "/tmp/matplotlib-cache"

RUN mkdir ${PYBASEBALL_CACHE}  \
    && mkdir ${MPLCONFIGDIR} \
    && python -m pip install --upgrade pip \
    && pip install -r requirements.txt

COPY . ${LAMBDA_TASK_ROOT}

CMD [ "lambda_function.lambda_handler" ]
