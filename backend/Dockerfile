### This is the container for our aws backend

FROM public.ecr.aws/lambda/python:3.11

COPY . ${LAMBDA_TASK_ROOT}

ENV PYBASEBALL_CACHE "/tmp/pybaseball-cache"
ENV MPLCONFIGDIR "/tmp/matplotlib-cache"

RUN mkdir ${PYBASEBALL_CACHE}  \
    && mkdir ${MPLCONFIGDIR} \
    && pip install -r requirements.txt

CMD [ "lambda_function.lambda_handler" ]
