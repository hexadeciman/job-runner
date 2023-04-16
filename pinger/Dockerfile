FROM alpine:3.7

RUN apk --no-cache add curl

COPY ./src ./
RUN chmod +x /*.sh

ENTRYPOINT ["/ping.sh"]
CMD [""]